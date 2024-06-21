import "dotenv/config";
import * as web3 from "@solana/web3.js";
import { initializeSquadsSDK } from "@/lib/squads";
import { getVault } from "@/utils/squads";
import { storeSettleTxPda } from "@/utils/storeUtils";

interface transferProps {
  msPda: string;
  recipient: string;
}

export async function POST(reqest: Request) {
  const squads = initializeSquadsSDK();

  const { recipient, msPda }: transferProps = await reqest.json();
  const msPda_pubKey = new web3.PublicKey(msPda);
  const recipient_pubKey = new web3.PublicKey(recipient);

  const vault = getVault(msPda_pubKey);
  if (vault) {
    const vaultBalance = await squads.connection.getBalance(vault);

    const instruction = web3.SystemProgram.transfer({
      fromPubkey: vault,
      toPubkey: recipient_pubKey,
      lamports: vaultBalance,
    });

    const tx = await squads.createTransaction(msPda_pubKey, 1); //vault
    await squads.addInstruction(tx.publicKey, instruction);
    await squads.activateTransaction(tx.publicKey);
    await squads.approveTransaction(tx.publicKey);

    const firstState = await squads.getTransaction(tx.publicKey);

    await storeSettleTxPda(msPda_pubKey, tx.publicKey);

    return Response.json({ firstState });
  }
}
