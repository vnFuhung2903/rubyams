import { PrismaClient, Bid, Prisma } from "@prisma/client";

export class BidRepository {
  private db: PrismaClient | Prisma.TransactionClient;
  constructor(db?: PrismaClient | Prisma.TransactionClient) {
    this.db = db || new PrismaClient(); 
  }

  async findByTxHash(txHash: string): Promise<Bid | null> {
    return this.db.bid.findUnique({
      where: { txHash },
    });
  }

  async findByBidder(bidder: string, semester?: number, page?: number, pageSize?: number): Promise<Bid[] | null> {
    const skip = page && pageSize ? (page - 1) * pageSize : 0;
    return this.db.bid.findMany({
      where: {
        bidder,
        course: {
          semester
        }
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });
  }

  async createBid(data: Prisma.BidCreateInput): Promise<Bid> {
    return this.db.bid.create({
      data: {
        ...data,
        result: true,
      },
    });
  }
}