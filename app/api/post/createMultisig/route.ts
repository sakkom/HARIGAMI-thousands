//MEMO_0620: Need to rethink rent allocation
import "dotenv/config";
import * as web3 from "@solana/web3.js";
import { initializeSquadsSDK, allocateMultisigPda } from "@/lib/squads";
import { Keypair } from "@solana/web3.js";
import { DEFAULT_MULTISIG_PROGRAM_ID, getAuthorityPDA } from "@sqds/sdk";
import BN from "bn.js";

interface createMultisigProps {
  threshold: number;
  initialMembers: string[];
}

export async function POST(request: Request) {
  const squads = initializeSquadsSDK();

  const createKey = Keypair.generate().publicKey;

  const { threshold, initialMembers }: createMultisigProps =
    await request.json();

  const initialMembers_pubKey = initialMembers.map(
    (member) => new web3.PublicKey(member),
  );

  const multisigAccount = await squads.createMultisig(
    threshold,
    createKey,
    initialMembers_pubKey,
  );

  const [vault] = getAuthorityPDA(
    multisigAccount.publicKey,
    new BN(1),
    DEFAULT_MULTISIG_PROGRAM_ID,
  );

  await allocateMultisigPda(multisigAccount.publicKey);

  const msPda = multisigAccount.publicKey.toBase58().toString();
  const vaultPda = vault.toBase58().toString();

  return Response.json({ msPda, vaultPda });
}
