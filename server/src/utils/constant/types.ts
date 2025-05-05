/**
 * Auction Datum structure that matches the contract's AuctionDatum
 */
export type AuctionDatum = {
  admin: string;
  auction_id: bigint;
  closed: boolean;
  bids: Bid[];
  students_max: bigint;
};

/**
 * Bid structure
 */
export type Bid = {
  bidder: string;
  amount: bigint;
};

/**
 * Auction redeemer types
 */
export type CreateAuctionRedeemer = {
  constructor: 0;
  fields: [bigint, bigint]; // new_auction_id, s_max
};

export type PlaceBidRedeemer = {
  constructor: 1;
  fields: [bigint]; // amount
};

export type EndAuctionRedeemer = {
  constructor: 2;
  fields: [bigint]; // end_auction_id
};

export type SendBackRedeemer = {
  constructor: 3;
  fields: [string]; // addr
};

/**
 * Judge Datum structure that matches the contract's JudgeDatum
 */
export type JudgeDatum = {
  admin: string;
  judge_id: bigint;
  closed: boolean;
  votes: Vote[];
};

/**
 * Vote structure
 */
export type Vote = {
  quality_name: string;
  voters: string[];
};

/**
 * Judge redeemer types
 */
export type CreateJudgeRedeemer = {
  constructor: 0;
  fields: [bigint]; // new_judge_id
};

export type PlaceVoteRedeemer = {
  constructor: 1;
  fields: [string]; // quality_name
};

export type EndJudgeRedeemer = {
  constructor: 2;
  fields: [bigint]; // end_judge_id
};

/**
 * NFT Action redeemer types
 */
export type MintNFTRedeemer = {
  constructor: 0;
  fields: [];
};

export type BurnNFTRedeemer = {
  constructor: 1;
  fields: [];
};

/**
 * Contract metadata
 */
export interface ContractConfig {
  auctionScriptAddress: string;
  auctionScriptHash: string;
  judgeScriptAddress: string;
  judgeScriptHash: string;
  nftPolicyId: string;
  assetName: string;
}

/**
 * Redeemer types as constr indices for PlutusV2 contracts
 */
export const AuctionRedeemerTypes = {
  CREATE_AUCTION: 0,
  PLACE_BID: 1,
  END_AUCTION: 2,
  SEND_BACK: 3,
};

export const JudgeRedeemerTypes = {
  CREATE_JUDGE: 0,
  PLACE_VOTE: 1,
  END_JUDGE: 2,
};

export const NFTRedeemerTypes = {
  MINT: 0,
  BURN: 1,
};
