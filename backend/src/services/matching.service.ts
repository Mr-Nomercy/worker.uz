import prisma from '../utils/prisma';

interface MatchResult {
  candidateId: string;
  jobId: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export const matchingService = {
  /**
   * Calculate match score between a job and candidate
   * Based on skill overlap from database
   */
  async calculateMatchScore(jobId: string, candidateId: string): Promise<MatchResult> {
    // Fetch job requirements
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { requirements: true },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    // Fetch candidate skills from profile
    const candidate = await prisma.user.findUnique({
      where: { id: candidateId },
      include: { profile: true },
    });

    if (!candidate || !candidate.profile) {
      throw new Error('Candidate not found');
    }

    const candidateSkills = candidate.profile.softSkills || [];
    const jobRequirements = job.requirements || [];

    // Calculate skill overlap
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const req of jobRequirements) {
      const matched = candidateSkills.some(
        skill => 
          skill.toLowerCase().includes(req.toLowerCase()) ||
          req.toLowerCase().includes(skill.toLowerCase())
      );
      
      if (matched) {
        matchedSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    }

    // Calculate score (0-100)
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
    });

    if (!job) {
      throw new Error('Job not found');
    }

    // Get all verified candidates
    const candidates = await prisma.user.findMany({
      where: { 
        role: 'CANDIDATE', 
        isVerified: true,
      },
      include: { profile: true },
    });

    // Calculate match for each candidate
    const matches: MatchResult[] = [];
    for (const candidate of candidates) {
      const match = await this.calculateMatchScore(jobId, candidate.id);
      matches.push(match);
    }

    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score);
  },

  /**
   * Get all jobs matched to a specific candidate
   */
  async matchJobsToCandidate(candidateId: string): Promise<MatchResult[]> {
    const candidate = await prisma.user.findUnique({
      where: { id: candidateId },
      include: { profile: true },
    });

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    // Get all open jobs
    const jobs = await prisma.job.findMany({
      where: { status: 'OPEN' },
    });

    // Calculate match for each job
    const matches: MatchResult[] = [];
    for (const job of jobs) {
      const match = await this.calculateMatchScore(job.id, candidateId);
      matches.push(match);
    }

    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score);
  },

  /**
   * Get top N candidates for a job (with threshold)
   */
  async getTopCandidatesForJob(
    jobId: string, 
    limit: number = 10, 
    minScore: number = 60
  ): Promise<MatchResult[]> {
    const allMatches = await this.matchCandidatesToJob(jobId);
    
    return allMatches
      .filter(m => m.score >= minScore)
      .slice(0, limit);
  },

  /**
   * Get top N jobs for a candidate (with threshold)
   */
  async getTopJobsForCandidate(
    candidateId: string, 
    limit: number = 10, 
    minScore: number = 60
  ): Promise<MatchResult[]> {
    const allMatches = await this.matchJobsToCandidate(candidateId);
    
    return allMatches
      .filter(m => m.score >= minScore)
      .slice(0, limit);
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
   * Update AI configuration
   */
  async updateAIConfig(data: {
    matchSensitivity?: number;
    minMatchScore?: number;
    maxCandidatesPerJob?: number;
    automatedVerification?: boolean;
    modelVersion?: string;
  }) {
    return prisma.aIConfig.update({
      where: { id: 'default' },
      data,
    });
  },

  /**
   * Batch calculate matches for dashboard display
   */
  async getDashboardMatches(candidateId: string) {
    const config = await this.getAIConfig();
    const minScore = config?.minMatchScore || 60;
    const limit = config?.maxCandidatesPerJob || 10;

    const topJobs = await this.getTopJobsForCandidate(candidateId, limit, minScore);

    // Enrich with job details
    const enrichedJobs = await Promise.all(
      topJobs.map(async (match) => {
        const job = await prisma.job.findUnique({
          where: { id: match.jobId },
          include: {
            company: {
              select: {
                id: true,
                name: true,
                industry: true,
                logoUrl: true,
              },
            },
            _count: {
              select: { applications: true },
            },
          },
        });
        return { ...match, job };
      })
    );

    return enrichedJobs;
  },
};

export default matchingService;
