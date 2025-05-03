import { Data } from "lucid-cardano";

const EvaluateDatumSchema = Data.Object({
    policyId: Data.Bytes(),
    assetName: Data.Bytes(),
    seller: Data.Bytes(),
    author: Data.Bytes(),
    price: Data.Integer(),
    royalties: Data.Integer(),
});

export type EvaluateDatum = Data.Static<typeof EvaluateDatumSchema>;
export const EvaluateDatum = EvaluateDatumSchema as unknown as EvaluateDatum;