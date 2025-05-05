import { 
  Lucid, 
  UTxO, 
  Constr,
  Data,
  TxComplete
} from "lucid-cardano";

import {
  AuctionDatum,
  Bid,
  ContractConfig,
  AuctionRedeemerTypes
} from "../utils/constant/types";


export class AuctionSDK {
  private lucid: Lucid;
  private config: ContractConfig;

  constructor(lucid: Lucid, config: ContractConfig) {
    this.lucid = lucid;
    this.config = config;
  }

  /**
   * Create a new auction
   * @param auctionId Unique identifier for the auction
   * @param studentsMax Maximum number of students allowed
   * @returns Unsigned transaction for frontend to sign
   */
  async createAuction(auctionId: number, studentsMax: number): Promise<TxComplete> {
    // Get the admin address (the wallet we're using)
    const adminAddress = await this.lucid.wallet.address();
    
    // Create the datum
    const datum: AuctionDatum = {
      admin: adminAddress,
      auction_id: BigInt(auctionId),
      closed: false,
      bids: [],
      students_max: BigInt(studentsMax)
    };
    
    // Create the redeemer
    const redeemer = new Constr(AuctionRedeemerTypes.CREATE_AUCTION, [
      BigInt(auctionId), 
      BigInt(studentsMax)
    ]);
    
    // Convert datum to Plutus data
    const plutusDatum = this.auctionDatumToPlutusData(datum);
    
    // Build transaction but don't sign it
    try {
      const tx = await this.lucid
        .newTx()
        .payToContract(
          this.config.auctionScriptAddress,
          { inline: plutusDatum },
          { lovelace: BigInt(2000000) } // Minimum ADA required
        )
        .attachSpendingValidator({
          type: "PlutusV2",
          script: this.config.auctionScriptHash
        })
        .complete();
  
      return tx;
    } catch (error) {
      console.error("Error creating auction transaction:", error);
      throw error;
    }
  }

  /**
   * Place a bid on an auction
   * @param auctionId The auction ID to bid on
   * @param amount Amount to bid
   * @returns Unsigned transaction for frontend to sign
   */
  async placeBid(auctionId: number, amount: number): Promise<TxComplete> {
    try {
      // Find the auction UTxO
      const auctionUtxo = await this.findAuctionUtxo(auctionId);
      if (!auctionUtxo) {
        throw new Error(`Auction with ID ${auctionId} not found or already closed`);
      }
      
      // Create the redeemer as proper Constr
      const redeemer = new Constr(AuctionRedeemerTypes.PLACE_BID, [BigInt(amount)]);
      
      // Build transaction but don't sign it
      const tx = await this.lucid
        .newTx()
        .collectFrom(
          [auctionUtxo],
          Data.to(redeemer)
        )
        .attachSpendingValidator({
          type: "PlutusV2",
          script: this.config.auctionScriptHash
        })
        .complete();
  
      return tx;
    } catch (error) {
      console.error("Error creating bid transaction:", error);
      throw error;
    }
  }

  /**
   * End an auction
   * @param auctionId The auction ID to end
   * @returns Unsigned transaction for frontend to sign
   */
  async endAuction(auctionId: number): Promise<TxComplete> {
    try {
      // Find the auction UTxO
      const auctionUtxo = await this.findAuctionUtxo(auctionId);
      if (!auctionUtxo) {
        throw new Error(`Auction with ID ${auctionId} not found or already closed`);
      }
      
      // Create the redeemer as proper Constr
      const redeemer = new Constr(AuctionRedeemerTypes.END_AUCTION, [BigInt(auctionId)]);
      
      // Build transaction but don't sign it
      const tx = await this.lucid
        .newTx()
        .collectFrom(
          [auctionUtxo],
          Data.to(redeemer)
        )
        .attachSpendingValidator({
          type: "PlutusV2",
          script: this.config.auctionScriptHash
        })
        .complete();
  
      return tx;
    } catch (error) {
      console.error("Error creating end auction transaction:", error);
      throw error;
    }
  }

  /**
   * Send tokens back to a student
   * @param auctionId The auction ID
   * @param studentAddress Address of the student to send tokens to
   * @returns Unsigned transaction for frontend to sign
   */
  async sendBack(auctionId: number, studentAddress: string): Promise<TxComplete> {
    try {
      // Find the auction UTxO
      const auctionUtxo = await this.findAuctionUtxo(auctionId);
      if (!auctionUtxo) {
        throw new Error(`Auction with ID ${auctionId} not found`);
      }
      
      // Create the redeemer as proper Constr
      const redeemer = new Constr(AuctionRedeemerTypes.SEND_BACK, [studentAddress]);
      
      // Build transaction but don't sign it
      const tx = await this.lucid
        .newTx()
        .collectFrom(
          [auctionUtxo],
          Data.to(redeemer)
        )
        .attachSpendingValidator({
          type: "PlutusV2",
          script: this.config.auctionScriptHash
        })
        .complete();
  
      return tx;
    } catch (error) {
      console.error("Error creating send back transaction:", error);
      throw error;
    }
  }

  /**
   * Get the current state of an auction
   * @param auctionId The auction ID to query
   * @returns The auction datum or null if not found
   */
  async getAuctionState(auctionId: number): Promise<AuctionDatum | null> {
    try {
      const auctionUtxo = await this.findAuctionUtxo(auctionId, true);
      if (!auctionUtxo || !auctionUtxo.datum) {
        return null;
      }
      
      // Convert the datum to AuctionDatum
      return this.plutusDataToAuctionDatum(auctionUtxo.datum);
    } catch (error) {
      console.error("Error getting auction state:", error);
      return null;
    }
  }

  /**
   * Get all bids for an auction
   * @param auctionId The auction ID to query
   * @returns Array of bids or empty array if auction not found
   */
  async getAuctionBids(auctionId: number): Promise<Bid[]> {
    const auctionState = await this.getAuctionState(auctionId);
    return auctionState ? auctionState.bids : [];
  }

  /**
   * Helper method to find an auction UTxO by ID
   * @param auctionId The auction ID to find
   * @param includeClosedAuctions Whether to include closed auctions in the search
   * @returns The UTxO or undefined if not found
   */
  private async findAuctionUtxo(
    auctionId: number,
    includeClosedAuctions: boolean = false
  ): Promise<UTxO | undefined> {
    const utxos = await this.lucid.utxosAt(this.config.auctionScriptAddress);
    
    for (const utxo of utxos) {
      if (!utxo.datum) continue;
      
      try {
        const datum = this.plutusDataToAuctionDatum(utxo.datum);
        
        if (datum.auction_id === BigInt(auctionId)) {
          if (includeClosedAuctions || !datum.closed) {
            return utxo;
          }
        }
      } catch (error) {
        continue;
      }
    }
    
    return undefined;
  }

  /**
   * Convert AuctionDatum to Plutus data for on-chain use
   * @param datum AuctionDatum object
   * @returns Plutus data representation
   */
  private auctionDatumToPlutusData(datum: AuctionDatum): string {
    // Create properly typed bids
    const bids = datum.bids.map(bid => 
      new Constr(0, [bid.bidder, bid.amount])
    );

    // Create properly typed datum
    const plutusDatum = new Constr(0, [
      datum.admin,
      datum.auction_id,
      datum.closed,
      bids,
      datum.students_max
    ]);

    // Serialize to string
    return Data.to(plutusDatum as Data);
  }

  /**
   * Convert Plutus data to AuctionDatum for client use
   * @param datumHex Hex string of the datum
   * @returns AuctionDatum object
   */
  private plutusDataToAuctionDatum(datumHex: string): AuctionDatum {
    // Parse the data
    const plutusData = Data.from(datumHex) as any;
    
    if (!plutusData || !plutusData.fields || plutusData.fields.length < 5) {
      throw new Error('Invalid datum structure');
    }
    
    // Extract fields
    const [admin, auctionId, closed, bidsList, studentsMax] = plutusData.fields;
    
    // Convert bids list
    const bids: Bid[] = bidsList.map((bid: any) => ({
      bidder: bid.fields[0],
      amount: bid.fields[1]
    }));
    
    return {
      admin,
      auction_id: auctionId,
      closed,
      bids,
      students_max: studentsMax
    };
  }
} 