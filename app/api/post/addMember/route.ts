import "dotenv/config";
import * as web3 from "@solana/web3.js";
import { initializeSquadsSDK } from "@/lib/squads";

interface addMemberProps {
  multisigPda: string;
  member: string;
}

export async function POST(request: Request) {
  const squads = initializeSquadsSDK();

  const { multisigPda, member }: addMemberProps = await request.json();

  const multisigPda_pubKey = new web3.PublicKey(multisigPda);
  const member_pubKey = new web3.PublicKey(member);

  let txBuilder = await squads.getTransactionBuilder(multisigPda_pubKey, 0);
  txBuilder = await txBuilder.withAddMember(member_pubKey);

  const [_txInstructions, txPDA] = await txBuilder.executeInstructions();

  const txState = await squads.activateTransaction(txPDA);

  console.log(txState);
  console.log(txPDA); //firestoreに保存

  return Response.json({ txPda: txPDA.toString() });
}
