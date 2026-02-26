import { z } from 'zod';

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+?[0-9]{9,15}$/, 'Noto\'g\'ri telefon raqami').optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  bio: z.string().max(2000).optional().nullable(),
  skills: z.array(z.string()).optional(),
  expectedSalary: z.number().min(0).optional().nullable(),
  experience: z.number().min(0).optional().nullable(),
});

export const educationSchema = z.object({
  institution: z.string().min(2).max(200),
  degree: z.string().min(2).max(100),
  fieldOfStudy: z.string().min(2).max(100).optional().nullable(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Noto\'g\'ri sana formati'),
  endDate: z.string().optional().nullable(),
  current: z.boolean().optional(),
});

export const workExperienceSchema = z.object({
  company: z.string().min(2).max(200),
  position: z.string().min(2).max(100),
  description: z.string().max(1000).optional().nullable(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Noto\'g\'ri sana formati'),
  endDate: z.string().optional().nullable(),
  current: z.boolean().optional(),
});

export const educationListSchema = z.array(educationSchema);
export const workExperienceListSchema = z.array(workExperienceSchema);

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type WorkExperienceInput = z.infer<typeof workExperienceSchema>;
