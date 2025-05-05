import { 
  Blockfrost, 
  Kupmios, 
  Lucid, 
  Network,
  Constr
} from "lucid-cardano";

/**
 * Initialize Lucid with Blockfrost provider
 * @param projectId Blockfrost API key
 * @param network Network to connect to ("Mainnet" | "Preview" | "Preprod" | "Custom")
 * @returns Initialized Lucid instance
 */
export async function initLucidWithBlockfrost(
  projectId: string, 
  network: Network = "Preview"
): Promise<Lucid> {
  const baseUrls = {
    Mainnet: "https://cardano-mainnet.blockfrost.io/api/v0",
    Preview: "https://cardano-preview.blockfrost.io/api/v0",
    Preprod: "https://cardano-preprod.blockfrost.io/api/v0",
    Custom: "https://cardano-preview.blockfrost.io/api/v0" // Default to Preview for custom
  };
  
  const baseUrl = baseUrls[network];
  
  return await Lucid.new(
    new Blockfrost(baseUrl, projectId),
    network
  );
}

/**
 * Initialize Lucid with Kupmios provider (local node)
 * @param kupoUrl URL for the Kupo service
 * @param ogmiosUrl URL for the Ogmios service
 * @param network Network to connect to ("Mainnet" | "Preview" | "Preprod" | "Custom")
 * @returns Initialized Lucid instance
 */
export async function initLucidWithKupmios(
  kupoUrl: string = "http://localhost:1442",
  ogmiosUrl: string = "http://localhost:1337",
  network: Network = "Preview"
): Promise<Lucid> {
  return await Lucid.new(
    new Kupmios(kupoUrl, ogmiosUrl),
    network
  );
}

/**
 * Select wallet from a private key
 * @param lucid Initialized Lucid instance
 * @param privateKey Private key to use
 * @returns The Lucid instance with wallet selected
 */
export function selectWalletFromPrivateKey(
  lucid: Lucid,
  privateKey: string
): Lucid {
  return lucid.selectWalletFromPrivateKey(privateKey);
}

/**
 * Select a read-only wallet address
 * @param lucid Initialized Lucid instance
 * @param address Address to use
 * @returns The Lucid instance with wallet address selected
 */
export function selectReadOnlyWallet(
  lucid: Lucid,
  address: string
): Lucid {
  return lucid.selectWalletFrom({
    address: address
  });
}

/**
 * Helper function to create a plutus data object for contract interactions
 * @param constructor The constructor index for the redeemer
 * @param fields The fields for the redeemer
 * @returns A properly formatted Constr object
 */
export function createConstrData(constructor: number, fields: any[] = []): Constr<any> {
  return new Constr(constructor, fields);
}

/**
 * Helper function to format BigInt numbers for display
 * @param num BigInt to format
 * @returns Formatted string
 */
export function formatBigInt(num: bigint): string {
  return num.toLocaleString();
}

/**
 * Helper function to wait for transaction confirmation
 * @param lucid Initialized Lucid instance
 * @param txHash Transaction hash to wait for
 * @param confirmations Number of confirmations to wait for
 * @returns Promise that resolves when the transaction is confirmed
 */
export async function waitForTx(
  lucid: Lucid, 
  txHash: string, 
  confirmations: number = 1
): Promise<boolean> {
  return new Promise((resolve) => {
    const checkTx = async () => {
      try {
        const status = await lucid.provider.getProtocolParameters();
        resolve(true);
      } catch (error) {
        setTimeout(checkTx, 3000);
      }
    };
    checkTx();
  });
} 