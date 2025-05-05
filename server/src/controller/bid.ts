import express, { Request, Response } from 'express';
import { BidService } from '../service/bid';
import { Prisma } from '@prisma/client';

const router = express.Router();
const bidService = new BidService();

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

router.get('/:txHash', async (req: Request, res: Response) => {
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