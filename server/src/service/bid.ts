import { BidRepository } from '../repositories/bid';
import { Prisma, Bid } from '@prisma/client';

export class BidService {
  private bidRepo: BidRepository;

  constructor(bidRepo?: BidRepository) {
    this.bidRepo = bidRepo || new BidRepository();
  }

  async placeBid(input: Prisma.BidCreateInput): Promise<Bid> {
    const existing = await this.bidRepo.findByTxHash(input.txHash);
    if (existing) {
      throw new Error(`Bid with txHash ${input.txHash} already exists`);
    }
    return this.bidRepo.createBid(input);
  }

  async getBidsByBidder(bidder: string, semester?: number, page?: number, pageSize?: number): Promise<Bid[] | null> {
    return this.bidRepo.findByBidder(bidder, semester, page, pageSize);
  }

  async getBidByTxHash(txHash: string): Promise<Bid | null> {
    return this.bidRepo.findByTxHash(txHash);
  }
}
