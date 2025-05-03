import { z } from "zod";

export const Bid = z.object({
  txHash: z.string().min(1),
  result: z.boolean(),
  bidder: z.string().min(1),
  courseId: z.number().int(),
  createdAt: z.date().default(new Date()),
  amount: z.number().int(),
});

export type Bid = z.infer<typeof Bid>;
