import "dotenv/config";
import * as web3 from "@solana/web3.js";
import { initializeSquadsSDK } from "@/lib/squads";

interface executeProps {
  txPda: string;
}

export async function POST(request: Request) {
  const squads = initializeSquadsSDK();

  const { txPda }: executeProps = await request.json();

  const txPda_pubKey = new web3.PublicKey(txPda);

  const txState = await squads.executeTransaction(txPda_pubKey);

  return Response.json({ txState });
}
