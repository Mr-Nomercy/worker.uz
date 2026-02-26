import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const createJobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  requirements: z.array(z.string()).min(1, 'At least one requirement'),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  location: z.string().min(2, 'Location is required'),
  jobType: z.enum(['full-time', 'part-time', 'contract']).default('full-time'),
});

export const updateJobSchema = createJobSchema.partial();

export const applyJobSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  coverLetter: z.string().max(2000, 'Cover letter too long').optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWING', 'INTERVIEW', 'REJECTED', 'ACCEPTED', 'WITHDRAWN']),
  notes: z.string().max(1000).optional(),
});

export const updateProfileSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[0-9]{9,15}$/, 'Invalid phone number').optional(),
  softSkills: z.array(z.string()).max(20, 'Maximum 20 skills'),
  portfolioLinks: z.array(z.object({
    label: z.string().min(1).max(50),
    url: z.string().url(),
  })).max(10, 'Maximum 10 portfolio links'),
});

export const verifyCompanySchema = z.object({
  verified: z.boolean(),
});

export const updateAIConfigSchema = z.object({
  matchSensitivity: z.number().int().min(0).max(100).optional(),
  minMatchScore: z.number().int().min(0).max(100).optional(),
  maxCandidatesPerJob: z.number().int().positive().max(100).optional(),
  automatedVerification: z.boolean().optional(),
  modelVersion: z.string().max(20).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const auditLogQuerySchema = paginationSchema.extend({
  action: z.string().optional(),
  entityType: z.string().optional(),
  userId: z.string().optional(),
});

export const companyQuerySchema = paginationSchema.extend({
  verified: z.coerce.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type ApplyJobInput = z.infer<typeof applyJobSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type VerifyCompanyInput = z.infer<typeof verifyCompanySchema>;
export type UpdateAIConfigInput = z.infer<typeof updateAIConfigSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type AuditLogQueryInput = z.infer<typeof auditLogQuerySchema>;
export type CompanyQueryInput = z.infer<typeof companyQuerySchema>;
