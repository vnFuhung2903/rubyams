import { VoteService } from '../service/vote';
import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';

const router = Router();
const voteService = new VoteService();

/**
 * @swagger
 * /votes/votes:
 *   post:
 *     tags:
 *       - Votes
 *     summary: Cast a new vote
 *     description: Submit a new quality vote for a course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Vote'
 *     responses:
 *       201:
 *         description: Vote cast successfully
 *       500:
 *         description: Server error
 */
router.post('/votes', async (req: Request, res: Response) => {
  try {
    const voteData: Prisma.VoteCreateInput = req.body;
    const vote = await voteService.castVote(voteData);
    res.status(201).json(vote);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

/**
 * @swagger
 * /votes/votes/voter/{voter}:
 *   get:
 *     tags:
 *       - Votes
 *     summary: Get votes by voter
 *     description: Retrieve all votes cast by a specific voter
 *     parameters:
 *       - in: path
 *         name: voter
 *         required: true
 *         description: Address of the voter
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         required: false
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of votes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Vote'
 *       500:
 *         description: Server error
 */
router.get('/votes/voter/:voter', async (req: Request, res: Response) => {
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

/**
 * @swagger
 * /votes/votes/txHash/{txHash}:
 *   get:
 *     tags:
 *       - Votes
 *     summary: Get vote by transaction hash
 *     description: Retrieve a specific vote by its transaction hash
 *     parameters:
 *       - in: path
 *         name: txHash
 *         required: true
 *         description: Transaction hash of the vote
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vote details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Vote'
 *       404:
 *         description: Vote not found
 *       500:
 *         description: Server error
 */
router.get('/votes/txHash/:txHash', async (req: Request, res: Response) => {
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