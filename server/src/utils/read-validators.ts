import { encode } from "cbor-x";
import { fromHex, SpendingValidator, toHex } from "lucid-cardano";
import contract from "../abi/contract.json";

const readClassValidator = function(): SpendingValidator {
    const classValidator = contract.validators.find(validator => {
        return validator.title === "class.class";
    })
    if (!classValidator) {
        throw new Error("Class validator not found in contract ABI.");
    }

    const classValidatorScript = toHex(encode(fromHex(classValidator.compiledCode)));
    return {
        type: "PlutusV2",
        script: classValidatorScript,
    }
}

const readEvaluateValidator = function(): SpendingValidator {
    const evaluateValidator = contract.validators.find(validator => {
        return validator.title === "evaluate.evaluate";
    })
    if (!evaluateValidator) {
        throw new Error("Class validator not found in contract ABI.");
    }

    const evaluateValidatorScript = toHex(encode(fromHex(evaluateValidator.compiledCode)));
    return {
        type: "PlutusV2",
        script: evaluateValidatorScript,
    }
}

export default { readClassValidator, readEvaluateValidator };

