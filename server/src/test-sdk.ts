import { initLucidWithBlockfrost, selectWalletFromPrivateKey, waitForTx } from "./utils/lucid-provider";
import { AuctionSDK } from "./sdk/auction-sdk";
import { JudgeSDK } from "./sdk/judge-sdk";
import { TxComplete, TxHash, TxSigned, Lucid } from "lucid-cardano";
import { getContractConfig } from "./utils/read-validators";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Example of how to use the Cardano SDKs with frontend signing
 */
async function runSDKExamples() {
  console.log("Starting SDK examples...");

  // This should be your own Blockfrost API key
  const blockfrostApiKey = process.env.BLOCKFROST_API_KEY!;
  
  // Initialize Lucid with Blockfrost
  const lucid = await initLucidWithBlockfrost(blockfrostApiKey, "Preview");
  
  // Load your wallet (KEEP YOUR PRIVATE KEY SECURE - DO NOT COMMIT TO REPO)
  // This should be your own private key for testing
  const privateKeyHex = "YOUR_PRIVATE_KEY_HEX";
  selectWalletFromPrivateKey(lucid, privateKeyHex);
  
  // Get contract configuration from validators
  console.log("Reading contract validators...");
  const config = await getContractConfig(lucid);
  console.log("Contract config:", {
    auctionScriptAddress: config.auctionScriptAddress,
    judgeScriptAddress: config.judgeScriptAddress
  });
  
  // Initialize the SDKs
  const auctionSDK = new AuctionSDK(lucid, config);
  const judgeSDK = new JudgeSDK(lucid, config);
  
  try {
    // First, airdrop some tADA for testing
    console.log("\n--- REQUESTING TEST ADA ---");
    const walletAddress = await lucid.wallet.address();
    console.log(`Wallet address: ${walletAddress}`);
    await requestAirdrop(walletAddress);
    console.log("Airdrop requested. Funds should arrive shortly.");
    
    // AUCTION EXAMPLES
    console.log("\n--- AUCTION EXAMPLES ---");
    await runAuctionExamples(auctionSDK, lucid);
    
    // JUDGE EXAMPLES
    // console.log("\n--- JUDGE EXAMPLES ---");
    // await runJudgeExamples(judgeSDK, lucid);
    
  } catch (error) {
    console.error("Error running examples:", error);
  }
}

/**
 * Auction SDK examples
 */
async function runAuctionExamples(auctionSDK: AuctionSDK, lucid: Lucid) {
  try {
    // Example 1: Create a new auction
    const auctionId = 1;
    const studentsMax = 10;
    console.log(`Creating auction with ID ${auctionId} and max students ${studentsMax}...`);
    
    // Get unsigned transaction
    const tx = await auctionSDK.createAuction(auctionId, studentsMax);
    console.log("Transaction created, ready for signing");
    
    // In a frontend application, this is where you would sign with the user's wallet
    // For this example, we'll sign with the private key
    const signedTx = await signTransaction(lucid, tx);
    const txHash = await submitTransaction(lucid, signedTx);
    console.log(`Auction created with tx hash: ${txHash}`);
    
    // Let's check if our auction exists
    const auctionState = await auctionSDK.getAuctionState(auctionId);
    console.log("Auction state:", auctionState);
    
    // Example 2: Place a bid
    console.log("\nPlacing a bid...");
    const bidAmount = 100;
    const bidTx = await auctionSDK.placeBid(auctionId, bidAmount);
    console.log("Bid transaction created, ready for signing");
    
    // Sign and submit
    const signedBidTx = await signTransaction(lucid, bidTx);
    const bidTxHash = await submitTransaction(lucid, signedBidTx);
    console.log(`Bid placed with tx hash: ${bidTxHash}`);
    
    // Get the updated bids
    const bids = await auctionSDK.getAuctionBids(auctionId);
    console.log("Current bids:", bids);
    
    // Example 3: End the auction
    console.log("\nEnding the auction...");
    const endTx = await auctionSDK.endAuction(auctionId);
    console.log("End auction transaction created, ready for signing");
    
    // Sign and submit
    const signedEndTx = await signTransaction(lucid, endTx);
    const endTxHash = await submitTransaction(lucid, signedEndTx);
    console.log(`Auction ended with tx hash: ${endTxHash}`);
    
    // Verify the auction is closed
    const finalState = await auctionSDK.getAuctionState(auctionId);
    console.log("Final auction state:", finalState);
    
  } catch (error) {
    console.error("Error in auction examples:", error);
  }
}

/**
 * Judge SDK examples
 */
async function runJudgeExamples(judgeSDK: JudgeSDK, lucid: Lucid) {
  try {
    // Example 1: Create a new judge evaluation
    const judgeId = 1;
    const qualities = ["Code Quality", "Innovation", "Usefulness", "Presentation"];
    console.log(`Creating judge evaluation with ID ${judgeId} and qualities ${qualities.join(', ')}...`);
    
    // Get unsigned transaction
    const tx = await judgeSDK.createJudge(judgeId, qualities);
    console.log("Transaction created, ready for signing");
    
    // Sign and submit
    const signedTx = await signTransaction(lucid, tx);
    const txHash = await submitTransaction(lucid, signedTx);
    console.log(`Judge evaluation created with tx hash: ${txHash}`);
    
    // Let's check if our judge evaluation exists
    const judgeState = await judgeSDK.getJudgeState(judgeId);
    console.log("Judge state:", judgeState);
    
    // Example 2: Place votes
    console.log("\nPlacing votes...");
    const voteTx = await judgeSDK.placeVote(judgeId, "Innovation");
    console.log("Vote transaction created, ready for signing");
    
    // Sign and submit
    const signedVoteTx = await signTransaction(lucid, voteTx);
    const voteTxHash = await submitTransaction(lucid, signedVoteTx);
    console.log(`Vote placed with tx hash: ${voteTxHash}`);
    
    // Get the vote results
    const voteResults = await judgeSDK.getVoteResults(judgeId);
    console.log("Current vote results:", voteResults);
    
    // Example 3: End the judge evaluation
    console.log("\nEnding the judge evaluation...");
    const endTx = await judgeSDK.endJudge(judgeId);
    console.log("End judge transaction created, ready for signing");
    
    // Sign and submit
    const signedEndTx = await signTransaction(lucid, endTx);
    const endTxHash = await submitTransaction(lucid, signedEndTx);
    console.log(`Judge evaluation ended with tx hash: ${endTxHash}`);
    
    // Verify the judge evaluation is closed
    const finalState = await judgeSDK.getJudgeState(judgeId);
    console.log("Final judge state:", finalState);
    
  } catch (error) {
    console.error("Error in judge examples:", error);
  }
}

/**
 * Signs a transaction with the current wallet
 * In a real frontend application, you would use the browser wallet APIs
 */
async function signTransaction(lucid: Lucid, tx: TxComplete): Promise<TxSigned> {
  return await tx.sign().complete();
}

/**
 * Submits a signed transaction to the blockchain
 * In a real frontend application, you might use the browser wallet APIs
 */
async function submitTransaction(lucid: Lucid, signedTx: TxSigned): Promise<TxHash> {
  const txHash = await signedTx.submit();
  
  // Wait for confirmation
  console.log("Waiting for transaction confirmation...");
  await waitForTx(lucid, txHash);
  console.log("Transaction confirmed!");
  
  return txHash;
}

/**
 * Requests tADA from the Preview testnet faucet
 * This uses the official Cardano Preview testnet faucet API
 * @param address The wallet address to receive the funds
 */
async function requestAirdrop(address: string): Promise<void> {
  try {
    // This is the official Cardano testnet faucet endpoint
    const faucetUrl = "https://faucet.preview.world.dev.cardano.org/basic-faucet/mainnet_ada";
    
    // Create request payload
    const payload = {
      address: address,
      api_key: "" // No API key needed for basic faucet
    };
    
    // Send request to faucet
    const response = await fetch(faucetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Faucet request failed: ${errorData}`);
    }
    
    const data = await response.json();
    console.log(`Airdrop requested successfully! Tx: ${data}`);
    console.log("Note: It may take a few minutes for funds to appear in your wallet.");
  } catch (error) {
    console.error("Error requesting airdrop:", error);
    console.log("Alternative: Use the Cardano testnet faucet at https://docs.cardano.org/cardano-testnet/tools/faucet");
  }
}

// Run the examples
runSDKExamples().finally(() => {
  console.log("\nExamples completed.");
}); 