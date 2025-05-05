# Cardano PlutusV2 SDK

This SDK provides TypeScript bindings to interact with PlutusV2 Cardano smart contracts. It includes support for two validator types:

1. **Auction Contract** - For managing auctions with bidding functionality
2. **Judge Contract** - For managing voting evaluations

## Installation

```bash
npm install lucid-cardano
```

## Contract Deployment

Before using the SDK, you need to compile and deploy your smart contracts:

1. Make sure your validators are compiled to PlutusV2 (check your aiken.toml)
2. Build your contract: `aiken build`
3. Get the validator addresses and script hashes from the generated `plutus.json` file

## SDK Setup

### Initialize Lucid

First, initialize Lucid with your preferred provider:

```typescript
import { initLucidWithBlockfrost } from './sdk/lucid-provider';

// For testnet
const lucid = await initLucidWithBlockfrost("YOUR_BLOCKFROST_API_KEY", "Preview");

// For mainnet
// const lucid = await initLucidWithBlockfrost("YOUR_BLOCKFROST_API_KEY", "Mainnet");
```

### Load Your Wallet

```typescript
import { selectWalletFromPrivateKey } from './sdk/lucid-provider';

// WARNING: Keep your private key secure, never commit it to a repository
const privateKey = "YOUR_PRIVATE_KEY";
selectWalletFromPrivateKey(lucid, privateKey);
```

### Configure Contract Parameters

Set up your contract config with the appropriate validator addresses and script hashes:

```typescript
import { ContractConfig } from './sdk/types';

const config: ContractConfig = {
  auctionScriptAddress: "addr_test1...", // The auction validator address
  auctionScriptHash: "script_hash_for_auction...", // Auction script hash
  judgeScriptAddress: "addr_test1...", // The judge validator address
  judgeScriptHash: "script_hash_for_judge...", // Judge script hash
  nftPolicyId: "policy_id_for_nft...", // NFT policy ID
  assetName: "asset_name..." // NFT asset name
};
```

## Using the Auction SDK

```typescript
import { AuctionSDK } from './sdk/auction-sdk';

// Initialize the SDK
const auctionSDK = new AuctionSDK(lucid, config);

// Create a new auction
const auctionId = 1;
const studentsMax = 10;
const txHash = await auctionSDK.createAuction(auctionId, studentsMax);
console.log(`Auction created with transaction: ${txHash}`);

// Place a bid
await auctionSDK.placeBid(auctionId, 100);

// Get auction state
const state = await auctionSDK.getAuctionState(auctionId);
console.log("Auction state:", state);

// End an auction
await auctionSDK.endAuction(auctionId);

// Send tokens back to a student
const studentAddress = "addr_test1...";
await auctionSDK.sendBack(auctionId, studentAddress);
```

## Using the Judge SDK

```typescript
import { JudgeSDK } from './sdk/judge-sdk';

// Initialize the SDK
const judgeSDK = new JudgeSDK(lucid, config);

// Create a new judge evaluation with quality categories
const judgeId = 1;
const qualities = ["Code Quality", "Innovation", "Usefulness", "Presentation"];
await judgeSDK.createJudge(judgeId, qualities);

// Place a vote for a quality
await judgeSDK.placeVote(judgeId, "Innovation");

// Get vote results
const results = await judgeSDK.getVoteResults(judgeId);
console.log("Vote results:", results);

// End the judge evaluation
await judgeSDK.endJudge(judgeId);
```

## Full Example

See the `server/src/examples/sdk-example.ts` file for a complete example of how to use both SDKs.

## Error Handling

The SDK includes error handling for common scenarios:

- Missing UTxOs
- Invalid datum
- Transaction failures

Always wrap your SDK calls in try/catch blocks to handle errors properly.

## Note on Contract Compatibility

This SDK is designed for PlutusV2 contracts. If you're using PlutusV1 or PlutusV3, you may need to adjust the validator type and data serialization accordingly.

## Development

To extend this SDK:

1. Add new transaction types to `types.ts`
2. Implement new contract interactions in the relevant SDK file
3. Update the README.md with examples of the new functionality 