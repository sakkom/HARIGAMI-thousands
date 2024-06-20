import "dotenv/config";
import * as web3 from "@solana/web3.js";
import { initializeSquadsSDK } from "@/lib/squads";

export async function GET(
  request: Request,
  { params }: { params: { multisigPda: string } },
) {
  const multisigPda = new web3.PublicKey(params.multisigPda);

  const squads = initializeSquadsSDK();

  const multisigAccount = await squads.getMultisig(multisigPda);

  return Response.json(multisigAccount);
}
