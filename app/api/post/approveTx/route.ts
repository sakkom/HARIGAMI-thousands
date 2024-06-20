import "dotenv/config";
import * as web3 from "@solana/web3.js";
import { initializeSquadsSDK } from "@/lib/squads";

interface approveProps {
  txPda: string;
}

export async function POST(request: Request) {
  const squads = initializeSquadsSDK();

  const { txPda }: approveProps = await request.json();

  const txPda_pubKey = new web3.PublicKey(txPda);

  const txState = await squads.approveTransaction(txPda_pubKey);

  return Response.json({ txState });
}
