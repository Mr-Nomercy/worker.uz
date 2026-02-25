import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDJqq7BHuuc_eY0sD5OVhg_LGuyzQdWxKs';

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
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const candidateSkills = candidate.softSkills.join(', ');
      const candidateExperience = candidate.workHistory
        .map(w => `${w.position} - ${w.company}`)
        .join('; ');
      const jobRequirements = job.requirements.join(', ');

      const prompt = `
Menga quyidagi ma'lumotlarni tahlil qilib, tavsiyalar bering:

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
      
      // Clean and parse JSON
      const jsonStr = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      
      return {
        matchScore: parsed.matchScore || parsed.compatibilityScore || 0,
        analysis: parsed.analysis || '',
        missingSkills: parsed.missingSkills || parsed.gaps || [],
        actionPlan: parsed.actionPlan || [],
      };
    } catch (error: any) {
      console.error('Gemini AI Error:', error);
      
      // Check for rate limit
      if (error?.message?.includes('429') || error?.message?.includes('rate limit')) {
        throw new Error('AI hozirda band, iltimos 1 daqiqadan so\'ng qayta urining.');
      }
      
      throw new Error('AI xizmatida xatolik yuz berdi. Qayta urinib ko\'ring.');
    }
  },

  async getAdviceWithContext(candidateId: string, jobId: string): Promise<AIAdviceResponse> {
    // This would fetch from database in controller
    // For now, returning structure
    return {
      matchScore: 0,
      analysis: '',
      missingSkills: [],
      actionPlan: []
    };
  }
};

export default aiService;
