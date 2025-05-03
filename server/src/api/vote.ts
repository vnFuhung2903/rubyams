import { VoteService } from '../service/vote';
import { Router } from 'express';
import { Prisma } from '@prisma/client';

const router = Router();
const voteService = new VoteService();

router.post('/votes', async (req, res) => {
  try {
    const voteData: Prisma.VoteCreateInput = req.body;
    const vote = await voteService.castVote(voteData);
    res.status(201).json(vote);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

router.get('/votes/voter/:voter', async (req, res) => {
  const { voter } = req.params;
  const { page, pageSize } = req.query;
  try {
    const votes = await voteService.getVotesByVoter(voter, Number(page), Number(pageSize));
    res.status(200).json(votes);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

router.get('/votes/txHash/:txHash', async (req, res) => {
  const { txHash } = req.params;
  try {
    const vote = await voteService.getVoteByTxHash(txHash);
    if (vote) {
      res.status(200).json(vote);
    } else {
      res.status(404).json({ error: 'Vote not found' });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

export default router;