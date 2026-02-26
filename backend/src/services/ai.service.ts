import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
} else {
  console.warn('⚠️  GOOGLE_API_KEY not set - AI features will use fallback mode');
}

interface CandidateProfile {
  fullName: string;
  softSkills: string[];
  workHistory: Array<{
    company: string;
    position: string;
  }>;
  educationHistory: Array<{
    institution: string;
    degree: string;
    field: string;
  }>;
}

interface JobDetails {
  title: string;
  company: {
    name: string;
  };
  requirements: string[];
  description: string;
}

interface ActionPlanItem {
  step: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface AIAdviceResponse {
  matchScore: number;
  analysis: string;
  missingSkills: string[];
  actionPlan: ActionPlanItem[];
}

const DEFAULT_AI_RESPONSE: AIAdviceResponse = {
  matchScore: 0,
  analysis: 'AI tahlili vaqtinchalik mavjud emas.',
  missingSkills: [],
  actionPlan: [
    {
      step: 1,
      title: 'Profil ma\'lumotlarini tekshirish',
      description: 'Profil ma\'lumotlarini to\'liq to\'ldiring va qayta urining.',
      priority: 'high'
    }
  ]
};

function sanitizeJSON(response: string): string {
  let cleaned = response.replace(/```json|```/g, '').trim();
  
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, '');
  
  return cleaned;
}

function parseAIResponse(response: string): AIAdviceResponse {
  try {
    const sanitized = sanitizeJSON(response);
    const parsed = JSON.parse(sanitized);
    
    const totalRequirements = parsed.requirements?.length || 0;
    const matchedSkills = parsed.missingSkills ? 
      Math.max(0, totalRequirements - parsed.missingSkills.length) : 0;
    
    let matchScore = parsed.matchScore || parsed.compatibilityScore || 0;
    
    if (totalRequirements > 0 && matchedSkills > 0) {
      matchScore = Math.round((matchedSkills / totalRequirements) * 100);
    }
    
    matchScore = Math.max(0, Math.min(100, Number(matchScore) || 0));
    
    return {
      matchScore,
      analysis: parsed.analysis || '',
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : 
                    Array.isArray(parsed.gaps) ? parsed.gaps : [],
      actionPlan: Array.isArray(parsed.actionPlan) ? parsed.actionPlan : []
    };
  } catch (parseError) {
    console.error('JSON Parse Error:', parseError);
    return DEFAULT_AI_RESPONSE;
  }
}

const systemPrompt = `Siz O'zbekiston mehnat bozori bo'yicha professional HR-maslahatchi va Karyera trenerisiz. 

Vazifangiz:
- Nomzodning ko'nikmalarini ish talablari bilan solishtirish
- Xolis, professional va dalda beruvchi tahlil berish
- Rivojlanish uchun aniq qadamlarni ko'rsatish
- Faqat o'zbek tilida javob berish

Javob formati (faqat JSON):
{
  "matchScore": 0-100,
  "analysis": "2-3 jumla tahlil",
  "missingSkills": ["ko'nikma1", "ko'nikma2"],
  "actionPlan": [
    {
      "step": 1,
      "title": "Amal nomi",
      "description": "Batafsil tavsif",
      "priority": "high|medium|low"
    }
  ]
}

Faqat JSON qaytaring, markdown ishlatmang.`;

export const aiService = {
  async getSmartAdvice(candidate: CandidateProfile, job: JobDetails): Promise<AIAdviceResponse> {
    try {
      if (!genAI) {
        return DEFAULT_AI_RESPONSE;
      }
      
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const candidateSkills = candidate.softSkills.join(', ');
      const candidateExperience = candidate.workHistory
        .map(w => `${w.position} - ${w.company}`)
        .join('; ');
      const jobRequirements = job.requirements.join(', ');

      const prompt = `
Meng quyidagi ma'lumotlarni tahlil qilib, tavsiyalar bering:

NOMZOD: ${candidate.fullName}
Ko'nikmalar: ${candidateSkills}
Ish tajribasi: ${candidateExperience}

LAVOZIM: ${job.title}
KOMPANIYA: ${job.company.name}
Talablar: ${jobRequirements}
Tavsif: ${job.description}

Quyidagilarni aniqlang:
1. Moslik foizi (0-100)
2. Qisqacha tahlil (2-3 jumla)
3. Yo'q ko'nikmalar (nima o'rganish kerak)
4. 3 ta aniq qadam (prioriteti bilan)

O'zbek tilida javob bering.
Faqat JSON qaytaring.
`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: {
          role: 'system',
          parts: [{ text: systemPrompt }]
        }
      });

      const response = result.response.text();
      
      return parseAIResponse(response);
    } catch (error) {
      console.error('Gemini AI Error:', error);
      const err = error as Error;
      
      if (err?.message?.includes('429') || err?.message?.includes('rate limit')) {
        return {
          ...DEFAULT_AI_RESPONSE,
          analysis: 'AI hozirda band, iltimos 1 daqiqadan so\'ng qayta urining.'
        };
      }
      
      return DEFAULT_AI_RESPONSE;
    }
  },

  async getAdviceWithContext(candidateId: string, jobId: string): Promise<AIAdviceResponse> {
    return DEFAULT_AI_RESPONSE;
  }
};

export default aiService;
