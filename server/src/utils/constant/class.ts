import { Data } from "lucid-cardano";

const ClassDatumSchema = Data.Object({
    policyId: Data.Bytes(),
    assetName: Data.Bytes(),
    seller: Data.Bytes(),
    author: Data.Bytes(),
    price: Data.Integer(),
    royalties: Data.Integer(),
});

export type ClassDatum = Data.Static<typeof ClassDatumSchema>;
export const ClassDatum = ClassDatumSchema as unknown as ClassDatum;