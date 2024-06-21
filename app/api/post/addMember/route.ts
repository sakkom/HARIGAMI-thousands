import "dotenv/config";
import * as web3 from "@solana/web3.js";
import { initializeSquadsSDK } from "@/lib/squads";
import { storeTxPda } from "@/utils/storeUtils";

interface addMemberProps {
  multisigPda: string;
  member: string;
}

export async function POST(request: Request) {
  const { multisigPda, member }: addMemberProps = await request.json();

  const squads = initializeSquadsSDK();

  const multisigPda_pubKey = new web3.PublicKey(multisigPda);
  const member_pubKey = new web3.PublicKey(member);

  const { keys } = await squads.getMultisig(multisigPda_pubKey);

  const nextMembers_len = keys.length + 1;

  const nextThreshold = Math.floor(nextMembers_len / 2) + 1;

  const isMemberAlready = keys.some(
    (key) => key.toBase58() === member_pubKey.toBase58(),
  );
  if (!isMemberAlready) {
    let txBuilder = await squads.getTransactionBuilder(multisigPda_pubKey, 0);
    txBuilder = await txBuilder.withAddMemberAndChangeThreshold(
      member_pubKey,
      nextThreshold,
    );

    const [_txInstructions, txPDA] = await txBuilder.executeInstructions();

    const txState_active = await squads.activateTransaction(txPDA);

    const txState_approve = await squads.approveTransaction(txPDA);

    // console.log(txState_active);
    // console.log(txState_approve);
    console.log(txPDA);

    await storeTxPda(multisigPda_pubKey, txPDA);

    return new Response("Success!", {
      status: 200,
    });
  } else {
    return new Response("Error: Member exist already", {
      status: 409,
    });
  }
}
