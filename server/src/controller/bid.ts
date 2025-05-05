import express, { Request, Response } from 'express';
import { BidService } from '../service/bid';
import { Prisma } from '@prisma/client';

const router = express.Router();
const bidService = new BidService();

/**
 * @swagger
 * /bids:
 *   post:
 *     tags:
 *       - Bids
 *     summary: Place a new bid
 *     description: Submit a new bid for a course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Bid'
 *     responses:
 *       201:
 *         description: Bid created successfully
 *       500:
 *         description: Server error
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const bidData: Prisma.BidCreateInput = req.body;
    const bid = await bidService.placeBid(bidData);
    res.status(201).json(bid);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

/**
 * @swagger
 * /bids/{bidder}:
 *   get:
 *     tags:
 *       - Bids
 *     summary: Get bids by bidder
 *     description: Retrieve all bids placed by a specific bidder
 *     parameters:
 *       - in: path
 *         name: bidder
 *         required: true
 *         description: Address of the bidder
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
 *         description: List of bids
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Bid'
 *       500:
 *         description: Server error
 */
router.get('/:bidder', async (req: Request, res: Response) => {
  const { bidder } = req.params;
  const { page, pageSize } = req.query;

  try {
    const bids = await bidService.getBidsByBidder(bidder, Number(page), Number(pageSize));
    res.status(200).json(bids);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

/**
 * @swagger
 * /bids/tx/{txHash}:
 *   get:
 *     tags:
 *       - Bids
 *     summary: Get bid by transaction hash
 *     description: Retrieve a specific bid by its transaction hash
 *     parameters:
 *       - in: path
 *         name: txHash
 *         required: true
 *         description: Transaction hash of the bid
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bid details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Bid'
 *       404:
 *         description: Bid not found
 *       500:
 *         description: Server error
 */
router.get('/tx/:txHash', async (req: Request, res: Response) => {
  const { txHash } = req.params;

  try {
    const bid = await bidService.getBidByTxHash(txHash);
    if (bid) {
      res.status(200).json(bid);
    } else {
      res.status(404).json({ error: 'Bid not found' });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

export default router;