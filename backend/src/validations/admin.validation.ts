import { z } from 'zod';

export const verifyCompanySchema = z.object({
  isVerified: z.boolean(),
  rejectionReason: z.string().max(500).optional().nullable(),
});

export const userSearchSchema = z.object({
  role: z.enum(['ADMIN', 'EMPLOYER', 'CANDIDATE']).optional(),
  isVerified: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const auditLogSearchSchema = z.object({
  userId: z.string().uuid().optional(),
  action: z.string().optional(),
  entityType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type VerifyCompanyInput = z.infer<typeof verifyCompanySchema>;
export type UserSearchInput = z.infer<typeof userSearchSchema>;
export type AuditLogSearchInput = z.infer<typeof auditLogSearchSchema>;
