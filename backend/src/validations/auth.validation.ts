import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Noto\'g\'ri email formati'),
  password: z.string().min(6, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
});

export const registerSchema = z.object({
  email: z.string().email('Noto\'g\'ri email formati'),
  password: z.string().min(6, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
  pinfl: z.string().length(14, 'PINFL 14 ta raqamdan iborat bo\'lishi kerak').regex(/^\d+$/, 'PINFL faqat raqamlardan iborat bo\'lishi kerak'),
  passportSeries: z.string().length(9, 'Pasport seriyasi 9 ta belgidan iborat bo\'lishi kerak'),
  fullName: z.string().min(2, 'To\'liq ism kamida 2 ta belgidan iborat bo\'lishi kerak').max(100, 'To\'liq ism 100 ta belgidan oshmasligi kerak'),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Noto\'g\'ri sana formati',
  }),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Joriy parol kiritilishi shart'),
  newPassword: z.string().min(6, 'Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
