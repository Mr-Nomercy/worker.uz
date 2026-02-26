import { z } from 'zod';

export const contactRequestSchema = z.object({
  candidateId: z.string().uuid('Noto\'g\'ri nomzod ID'),
  jobId: z.string().uuid('Noto\'g\'ri vakansiya ID').optional(),
  message: z.string().max(500).optional().nullable(),
});

export const contactRequestResponseSchema = z.object({
  action: z.enum(['ACCEPT', 'REJECT']),
  message: z.string().max(500).optional().nullable(),
});

export const candidateSearchSchema = z.object({
  query: z.string().optional(),
  skills: z.string().optional(),
  experienceMin: z.coerce.number().int().min(0).optional(),
  experienceMax: z.coerce.number().int().min(0).optional(),
  location: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  isVerified: z.coerce.boolean().optional(),
});

export type ContactRequestInput = z.infer<typeof contactRequestSchema>;
export type ContactRequestResponseInput = z.infer<typeof contactRequestResponseSchema>;
export type CandidateSearchInput = z.infer<typeof candidateSearchSchema>;
