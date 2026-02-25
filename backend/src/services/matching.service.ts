import prisma from '../utils/prisma';

interface MatchResult {
  candidateId: string;
  jobId: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

interface SkillProfile {
  hardSkills: string[];
  softSkills: string[];
  workHistory: Array<{
    position?: string | null;
    company?: string | null;
  }>;
}

export const matchingService = {
  /**
   * Calculate match score between a job and candidate profile
   * Based on skill overlap and experience relevance
   */
  calculateMatchScore(jobId: string, candidateId: string): MatchResult {
    // This would be more sophisticated in production with actual ML
    // For now, using a weighted algorithm based on skills
    
    const jobRequirements = JOB_REQUIREMENTS_MAP[jobId] || [];
    const candidateSkills = CANDIDATE_SKILLS_MAP[candidateId] || [];
    
    const matchedSkills = jobRequirements.filter(skill =>
      candidateSkills.some(cs => 
        cs.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(cs.toLowerCase())
      )
    );
    
    const missingSkills = jobRequirements.filter(skill =>
      !matchedSkills.includes(skill)
    );
    
    // Calculate percentage
    const score = jobRequirements.length > 0
      ? Math.round((matchedSkills.length / jobRequirements.length) * 100)
      : 0;
    
    return {
      candidateId,
      jobId,
      score: Math.min(score, 100),
      matchedSkills,
      missingSkills,
    };
  },

  /**
   * Get all candidates matched to a specific job
   */
  async matchCandidatesToJob(jobId: string): Promise<MatchResult[]> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    const candidates = await prisma.user.findMany({
      where: { role: 'CANDIDATE', isVerified: true },
      include: { profile: true },
    });

    const matches = candidates.map(candidate => 
      this.calculateMatchScore(jobId, candidate.id)
    );

    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score);
  },

  /**
   * Get all jobs matched to a specific candidate
   */
  async matchJobsToCandidate(candidateId: string): Promise<MatchResult[]> {
    const jobs = await prisma.job.findMany({
      where: { status: 'OPEN' },
      include: { company: true },
    });

    const matches = jobs.map(job => 
      this.calculateMatchScore(job.id, candidateId)
    );

    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score);
  },

  /**
   * Get AI configuration
   */
  async getAIConfig() {
    return prisma.aIConfig.findUnique({
      where: { id: 'default' },
    });
  },

  /**
   * Update AI configuration (admin only)
   */
  async updateAIConfig(data: {
    matchSensitivity?: number;
    minMatchScore?: number;
    maxCandidatesPerJob?: number;
    automatedVerification?: boolean;
  }) {
    return prisma.aIConfig.update({
      where: { id: 'default' },
      data,
    });
  },
};

// Mock data maps - in production, this would analyze actual profile data
const JOB_REQUIREMENTS_MAP: Record<string, string[]> = {
  'job-1': ['React', 'Node.js', 'TypeScript', 'JavaScript', 'PostgreSQL'],
  'job-2': ['Python', 'PostgreSQL', 'AWS', 'Django', 'REST API'],
  'job-3': ['Kubernetes', 'Docker', 'AWS', 'CI/CD', 'Linux'],
  'job-4': ['Figma', 'UI Design', 'Prototyping', 'Adobe XD'],
};

const CANDIDATE_SKILLS_MAP: Record<string, string[]> = {
  'candidate-1': ['React', 'Node.js', 'TypeScript', 'JavaScript', 'Team Leadership'],
  'candidate-2': ['Python', 'Django', 'PostgreSQL', 'Backend'],
  'candidate-3': ['Kubernetes', 'Docker', 'AWS', 'DevOps'],
};

export default matchingService;
