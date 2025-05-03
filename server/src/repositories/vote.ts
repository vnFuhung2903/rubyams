import { Prisma, PrismaClient, Vote } from "@prisma/client";

export class VoteRepository {
    private db: PrismaClient | Prisma.TransactionClient;
    constructor(db?: PrismaClient | Prisma.TransactionClient) {
      this.db = db || new PrismaClient(); 
    }

  async findByTxHash(txHash: string): Promise<Vote | null> {
    return this.db.vote.findUnique({
      where: { txHash },
    });
  }

  async findByVoter(voter: string, semester?: number, page?: number, pageSize?: number): Promise<Vote[] | null> {
      const skip = page && pageSize ? (page - 1) * pageSize : 0;
      return this.db.vote.findMany({
        where: {
          voter,
          course: {
            semester
          }
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      });
    }

  async createVote(data: Prisma.VoteCreateInput): Promise<Vote> {
    return this.db.vote.create({
      data: {
        ...data,
      },
    });
  }
}
