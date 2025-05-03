import { z } from "zod";

export const Vote = z.object({
  txHash: z.string(),
  score: z.number().int(),
  voter: z.string(),
  courseId: z.number().int(),
  createdAt: z.date().default(new Date()),
});

export type Vote = z.infer<typeof Vote>;
