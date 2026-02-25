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

interface AIAdviceResponse {
  compatibilityScore: number;
  analysis: string;
  strengths: string[];
  gaps: string[];
  actionPlan: Array<{
    step: number;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  language: string;
}

const systemPrompt = `You are "Worker AI Career Coach" - a professional HR specialist and career counselor specializing in the Uzbekistan job market.

Your role:
- Analyze job matches between candidates and employers
- Provide constructive, encouraging feedback
- Understand Uzbekistan's labor market context (growing IT sector, government digitization initiatives, local business culture)
- Speak professionally but warmly

Response Format (JSON only):
{
  "compatibilityScore": 0-100,
  "analysis": "2-3 sentence overview",
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"],
  "actionPlan": [
    {
      "step": 1,
      "title": "Action title",
      "description": "What to do",
      "priority": "high|medium|low"
    }
  ]
}

Always respond in the same language as the request (Uzbek or Russian).`;

export const aiService = {
  async getSmartAdvice(candidate: CandidateProfile, job: JobDetails): Promise<AIAdviceResponse> {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const candidateSkills = candidate.softSkills.join(', ');
      const candidateExperience = candidate.workHistory
        .map(w => `${w.position} at ${w.company}`)
        .join('; ');
      const jobRequirements = job.requirements.join(', ');

      const prompt = `
Analyze this job match in Uzbekistan:

CANDIDATE: ${candidate.fullName}
Skills: ${candidateSkills}
Experience: ${candidateExperience}

JOB: ${job.title} at ${job.company.name}
Requirements: ${jobRequirements}
Description: ${job.description}

Provide:
1. Compatibility score (0-100)
2. Key strengths (what matches well)
3. Gaps (what's missing)
4. Action plan (3 specific steps to improve match)

Respond in Uzbek language.
Return ONLY valid JSON, no markdown.
`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Clean the response and parse JSON
      const jsonStr = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      
      return {
        compatibilityScore: parsed.compatibilityScore || 0,
        analysis: parsed.analysis || '',
        strengths: parsed.strengths || [],
        gaps: parsed.gaps || [],
        actionPlan: parsed.actionPlan || [],
        language: 'uz',
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('AI service temporarily unavailable');
    }
  },

  async getRussianAdvice(candidate: CandidateProfile, job: JobDetails): Promise<AIAdviceResponse> {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const candidateSkills = candidate.softSkills.join(', ');
      const candidateExperience = candidate.workHistory
        .map(w => `${w.position} at ${w.company}`)
        .join('; ');
      const jobRequirements = job.requirements.join(', ');

      const prompt = `
Проанализируйте это совпадение вакансии в Узбекистане:

КАНДИДАТ: ${candidate.fullName}
Навыки: ${candidateSkills}
Опыт: ${candidateExperience}

ВАКАНСИЯ: ${job.title} в ${job.company.name}
Требования: ${jobRequirements}
Описание: ${job.description}

Предоставьте:
1. Оценка совместимости (0-100)
2. Ключевые сильные стороны
3. Пробелы
4. План действий (3 конкретных шага)

Ответьте на русском языке.
Верните ТОЛЬКО чистый JSON, без markdown.
`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      const jsonStr = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      
      return {
        compatibilityScore: parsed.compatibilityScore || 0,
        analysis: parsed.analysis || '',
        strengths: parsed.strengths || [],
        gaps: parsed.gaps || [],
        actionPlan: parsed.actionPlan || [],
        language: 'ru',
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('AI service temporarily unavailable');
    }
  },
};

export default aiService;
