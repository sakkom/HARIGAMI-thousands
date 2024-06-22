import "dotenv/config";
import * as web3 from "@solana/web3.js";
import { initializeSquadsSDK } from "@/lib/squads";

export async function GET(
  request: Request,
  { params }: { params: { txPda: string } },
) {
  console.log("hello");
  const txPda = new web3.PublicKey(params.txPda);

  const squads = initializeSquadsSDK();

  const txState = await squads.getTransaction(txPda);
  // console.log("txAccount:", txAccount);

  return Response.json({ txState });
}
