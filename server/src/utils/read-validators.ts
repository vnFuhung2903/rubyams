import { encode } from "cbor-x";
import { 
    fromHex, 
    SpendingValidator, 
    toHex, 
    Lucid,
} from "lucid-cardano";
import contract from "../abi/contract.json";

/**
 * Gets validator details for ContractConfig
 * @param lucid Initialized Lucid instance
 * @returns Object with validator details needed for ContractConfig
 */
export async function getContractConfig(lucid: Lucid) {
    // Get the class validator (auction)
    const classValidator = readClassValidator();
    const auctionScriptHash = lucid.utils.validatorToScriptHash(classValidator);
    const auctionScriptAddress = lucid.utils.validatorToAddress(classValidator);
    
    // Get the evaluate validator (judge)
    const evaluateValidator = readEvaluateValidator();
    const judgeScriptHash = lucid.utils.validatorToScriptHash(evaluateValidator);
    const judgeScriptAddress = lucid.utils.validatorToAddress(evaluateValidator);
    
    // Get NFT policy details - if you have NFT minting policy
    // For now using placeholders - replace with actual values
    const nftPolicyId = "policy_id_for_nft";
    const assetName = "asset_name";
    
    return {
        auctionScriptAddress,
        auctionScriptHash,
        judgeScriptAddress,
        judgeScriptHash,
        nftPolicyId,
        assetName
    };
}

/**
 * Reads and formats the class (auction) validator 
 */
export function readClassValidator(): SpendingValidator {
    const classValidator = contract.validators.find(validator => {
        return validator.title === "class.class";
    });
    
    if (!classValidator) {
        throw new Error("Class validator not found in contract ABI.");
    }

    const classValidatorScript = toHex(encode(fromHex(classValidator.compiledCode)));
    return {
        type: "PlutusV2",
        script: classValidatorScript,
    };
}

/**
 * Reads and formats the evaluate (judge) validator
 */
export function readEvaluateValidator(): SpendingValidator {
    const evaluateValidator = contract.validators.find(validator => {
        return validator.title === "evaluate.evaluate";
    });
    
    if (!evaluateValidator) {
        throw new Error("Evaluate validator not found in contract ABI.");
    }

    const evaluateValidatorScript = toHex(encode(fromHex(evaluateValidator.compiledCode)));
    return {
        type: "PlutusV2",
        script: evaluateValidatorScript,
    };
}

/**
 * Utility to get all validators formatted as needed for SDK
 */
export default { readClassValidator, readEvaluateValidator, getContractConfig };

