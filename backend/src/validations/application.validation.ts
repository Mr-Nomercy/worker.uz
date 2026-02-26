import { z } from 'zod';

export const applicationCreateSchema = z.object({
  jobId: z.string().uuid('Noto\'g\'ri vakansiya ID'),
  coverLetter: z.string().max(2000).optional().nullable(),
});

export const applicationUpdateSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWING', 'INTERVIEW', 'REJECTED', 'ACCEPTED']),
  notes: z.string().max(1000).optional().nullable(),
});

export const applicationSearchSchema = z.object({
  jobId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'REVIEWING', 'INTERVIEW', 'REJECTED', 'ACCEPTED']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ApplicationCreateInput = z.infer<typeof applicationCreateSchema>;
export type ApplicationUpdateInput = z.infer<typeof applicationUpdateSchema>;
export type ApplicationSearchInput = z.infer<typeof applicationSearchSchema>;
