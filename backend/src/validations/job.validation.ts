import { z } from 'zod';

export const jobCreateSchema = z.object({
  title: z.string().min(5, 'Vakansiya nomi kamida 5 ta belgidan iborat bo\'lishi kerak').max(200),
  description: z.string().min(50, 'Tavsif kamida 50 ta belgidan iborat bo\'lishi kerak').max(5000),
  requirements: z.string().max(3000).optional().nullable(),
  location: z.string().min(2, 'Manzil kiritilishi shart').max(200),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']),
  salaryMin: z.number().min(0).optional().nullable(),
  salaryMax: z.number().min(0).optional().nullable(),
  salaryCurrency: z.string().length(3, 'Valyuta kodi 3 ta belgi').default('UZS'),
  category: z.string().min(2).max(100),
  experienceLevel: z.enum(['ENTRY', 'MIDDLE', 'SENIOR', 'LEAD', 'EXECUTIVE']).default('MIDDLE'),
  isActive: z.boolean().default(true),
});

export const jobUpdateSchema = jobCreateSchema.partial();

export const jobSearchSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']).optional(),
  category: z.string().optional(),
  experienceLevel: z.enum(['ENTRY', 'MIDDLE', 'SENIOR', 'LEAD', 'EXECUTIVE']).optional(),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'salaryMin', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type JobCreateInput = z.infer<typeof jobCreateSchema>;
export type JobUpdateInput = z.infer<typeof jobUpdateSchema>;
export type JobSearchInput = z.infer<typeof jobSearchSchema>;
