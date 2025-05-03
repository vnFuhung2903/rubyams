import { z } from 'zod';

export const Course = z.object({
  id: z.number().int(),
  courseName: z.string(),
  teacherName: z.string(),
  semester: z.number(),
  students: z.array(z.object({
    // Assuming StudentsCourses is a relationship, you might want to define it as a separate schema
    studentId: z.number().int(),
    courseId: z.number().int()
  })),
  inProgress: z.boolean().default(false), // Default false for inProgress
  weekday: z.number().int(),
  startTime: z.date(),
  endTime: z.date(),
  capacity: z.number().int(),
}).refine(data => data.startTime < data.endTime, {
  message: "Start time must be before end time",
  path: ["startTime", "endTime"]
});

export type Course = z.infer<typeof Course>
