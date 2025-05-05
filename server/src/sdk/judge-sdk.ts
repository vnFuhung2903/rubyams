import { 
  Lucid, 
  UTxO, 
  TxComplete,
  Constr,
  Data
} from "lucid-cardano";

import {
  JudgeDatum,
  Vote,
  ContractConfig,
  JudgeRedeemerTypes
} from "../utils/constant/types";


export class JudgeSDK {
  private lucid: Lucid;
  private config: ContractConfig;

  constructor(lucid: Lucid, config: ContractConfig) {
    this.lucid = lucid;
    this.config = config;
  }

  /**
   * Create a new judge evaluation
   * @param judgeId Unique identifier for the judge evaluation
   * @param initialQualities Initial quality names to vote on
   * @returns Unsigned transaction for frontend to sign
   */
  async createJudge(judgeId: number, initialQualities: string[] = ["Quality"]): Promise<TxComplete> {
    // Get the admin address (the wallet we're using)
    const adminAddress = await this.lucid.wallet.address();

    // Create the datum with initial empty votes for each quality
    const votes: Vote[] = initialQualities.map(qualityName => ({
      quality_name: qualityName,
      voters: []
    }));
    
    const datum: JudgeDatum = {
      admin: adminAddress,
      judge_id: BigInt(judgeId),
      closed: false,
      votes: votes
    };
    
    // Create the redeemer
    const redeemer = new Constr(JudgeRedeemerTypes.CREATE_JUDGE, [BigInt(judgeId)]);
    
    // Convert datum to Plutus data
    const plutusDatum = this.judgeDatumToPlutusData(datum);
    
    // Build transaction but don't sign it
    try {
      const tx = await this.lucid
        .newTx()
        .payToContract(
          this.config.judgeScriptAddress,
          { inline: plutusDatum },
          { lovelace: BigInt(2000000) } // Minimum ADA required
        )
        .attachSpendingValidator({
          type: "PlutusV2",
          script: this.config.judgeScriptHash
        })
        .complete();
  
      return tx;
    } catch (error) {
      console.error("Error creating judge evaluation transaction:", error);
      throw error;
    }
  }

  /**
   * Place a vote on a quality
   * @param judgeId The judge ID to vote on
   * @param qualityName The quality name to vote for
   * @returns Unsigned transaction for frontend to sign
   */
  async placeVote(judgeId: number, qualityName: string): Promise<TxComplete> {
    try {
      // Find the judge UTxO
      const judgeUtxo = await this.findJudgeUtxo(judgeId);
      if (!judgeUtxo) {
        throw new Error(`Judge evaluation with ID ${judgeId} not found or already closed`);
      }
      
      // Create the redeemer
      const redeemer = new Constr(JudgeRedeemerTypes.PLACE_VOTE, [qualityName]);
      
      // Build transaction but don't sign it
      const tx = await this.lucid
        .newTx()
        .collectFrom(
          [judgeUtxo],
          Data.to(redeemer as Data)
        )
        .attachSpendingValidator({
          type: "PlutusV2",
          script: this.config.judgeScriptHash
        })
        .complete();
  
      return tx;
    } catch (error) {
      console.error("Error creating place vote transaction:", error);
      throw error;
    }
  }

  /**
   * End a judge evaluation
   * @param judgeId The judge ID to end
   * @returns Unsigned transaction for frontend to sign
   */
  async endJudge(judgeId: number): Promise<TxComplete> {
    try {
      // Find the judge UTxO
      const judgeUtxo = await this.findJudgeUtxo(judgeId);
      if (!judgeUtxo) {
        throw new Error(`Judge evaluation with ID ${judgeId} not found or already closed`);
      }
      
      // Create the redeemer
      const redeemer = new Constr(JudgeRedeemerTypes.END_JUDGE, [BigInt(judgeId)]);
      
      // Build transaction but don't sign it
      const tx = await this.lucid
        .newTx()
        .collectFrom(
          [judgeUtxo],
          Data.to(redeemer as Data)
        )
        .attachSpendingValidator({
          type: "PlutusV2",
          script: this.config.judgeScriptHash
        })
        .complete();
  
      return tx;
    } catch (error) {
      console.error("Error creating end judge transaction:", error);
      throw error;
    }
  }

  /**
   * Get the current state of a judge evaluation
   * @param judgeId The judge ID to query
   * @returns The judge datum or null if not found
   */
  async getJudgeState(judgeId: number): Promise<JudgeDatum | null> {
    try {
      const judgeUtxo = await this.findJudgeUtxo(judgeId, true);
      if (!judgeUtxo || !judgeUtxo.datum) {
        return null;
      }
      
      // Convert the datum to JudgeDatum
      return this.plutusDataToJudgeDatum(judgeUtxo.datum);
    } catch (error) {
      console.error("Error getting judge state:", error);
      return null;
    }
  }

  /**
   * Get vote results for a judge evaluation
   * @param judgeId The judge ID to query
   * @returns Vote results with counts
   */
  async getVoteResults(judgeId: number): Promise<Array<{quality: string, votes: number}>> {
    const judgeState = await this.getJudgeState(judgeId);
    if (!judgeState) return [];
    
    return judgeState.votes.map(vote => ({
      quality: vote.quality_name,
      votes: vote.voters.length
    }));
  }

  /**
   * Helper method to find a judge evaluation UTxO by ID
   * @param judgeId The judge ID to find
   * @param includeClosedJudges Whether to include closed judge evaluations in the search
   * @returns The UTxO or undefined if not found
   */
  private async findJudgeUtxo(
    judgeId: number,
    includeClosedJudges: boolean = false
  ): Promise<UTxO | undefined> {
    const utxos = await this.lucid.utxosAt(this.config.judgeScriptAddress);
    
    for (const utxo of utxos) {
      if (!utxo.datum) continue;
      
      try {
        const datum = this.plutusDataToJudgeDatum(utxo.datum);
        
        if (datum.judge_id === BigInt(judgeId)) {
          if (includeClosedJudges || !datum.closed) {
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
   * Convert JudgeDatum to Plutus data for on-chain use
   * @param datum JudgeDatum object
   * @returns Plutus data representation
   */
  private judgeDatumToPlutusData(datum: JudgeDatum): string {
    // Create properly typed votes
    const votes = datum.votes.map(vote => 
      new Constr(0, [
        vote.quality_name,
        vote.voters
      ])
    );

    // Create properly typed datum
    const plutusDatum = new Constr(0, [
      datum.admin,
      datum.judge_id,
      datum.closed,
      votes
    ]);

    // Serialize to string
    return Data.to(plutusDatum as Data);
  }

  /**
   * Convert Plutus data to JudgeDatum for client use
   * @param datumHex Hex string of the datum
   * @returns JudgeDatum object
   */
  private plutusDataToJudgeDatum(datumHex: string): JudgeDatum {
    // Parse the data
    const plutusData = Data.from(datumHex) as any;
    
    if (!plutusData || !plutusData.fields || !Array.isArray(plutusData.fields) || plutusData.fields.length < 4) {
      throw new Error('Invalid datum structure');
    }
    
    // Extract fields from the Constr
    const [admin, judgeId, closed, votesList] = plutusData.fields;
    
    // Convert votes list
    const votes: Vote[] = votesList.map((vote: any) => ({
      quality_name: vote.fields[0],
      voters: vote.fields[1]
    }));
    
    return {
      admin,
      judge_id: judgeId,
      closed,
      votes
    };
  }
} 