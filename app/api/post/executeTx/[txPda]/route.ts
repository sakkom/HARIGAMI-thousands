import "dotenv/config";
import * as web3 from "@solana/web3.js";
import { initializeSquadsSDK } from "@/lib/squads";

export async function POST(
  request: Request,
  { params }: { params: { txPda: string } },
) {
  const squads = initializeSquadsSDK();

  const txPda = new web3.PublicKey(params.txPda);

  const txPda_pubKey = new web3.PublicKey(txPda);

  const txState = await squads.executeTransaction(txPda_pubKey);

  return Response.json({ txState });
}
