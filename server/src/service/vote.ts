import { VoteRepository } from '../repositories/vote';
import { Prisma, Vote } from '@prisma/client';

export class VoteService {
  private voteRepo: VoteRepository;

  constructor(voteRepo?: VoteRepository) {
    this.voteRepo = voteRepo || new VoteRepository();
  }

  async castVote(input: Prisma.VoteCreateInput): Promise<Vote> {
    const existing = await this.voteRepo.findByTxHash(input.txHash);
    if (existing) {
      throw new Error(`Vote with txHash ${input.txHash} already exists`);
    }
    return this.voteRepo.createVote(input);
  }

  async getVotesByVoter(voter: string, semester?: number, page?: number, pageSize?: number): Promise<Vote[] | null> {
    return this.voteRepo.findByVoter(voter, semester, page, pageSize);
  }

  async getVoteByTxHash(txHash: string): Promise<Vote | null> {
    return this.voteRepo.findByTxHash(txHash);
  }
}
