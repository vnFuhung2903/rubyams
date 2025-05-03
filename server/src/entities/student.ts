import { z } from 'zod';
import { User } from './user';

export const Student = z.object({
  userId: z.number().int(),
  user: User,
  name: z.string(),
  studentNumber: z.number().int(),
  nftAddress: z.string().min(1),
  academicYear: z.number().int(),
  courses: z.array(z.object({
    courseId: z.number().int(),
    studentId: z.number().int(),
  })).optional(),
  enrolledAt: z.date(),
  deletedAt: z.date().optional(),
  wallet: z.string().optional(),
  graduated: z.boolean().default(false),
});

export type Student = z.infer<typeof Student>;