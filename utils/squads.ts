import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Squads, {
  DEFAULT_MULTISIG_PROGRAM_ID,
  Wallet,
  getAuthorityPDA,
} from "@sqds/sdk";
import BN from "bn.js";
import * as web3 from "@solana/web3.js";

export const createHarigamiSquad = async (
  wallet: any,
  createKey: any,
  initialMembers: any[],
  name: string,
) => {
  const squads = Squads.devnet(wallet, { commitmentOrConfig: "confirmed" });

  const threshold = 1;

  const multisigAccount = await squads.createMultisig(
    threshold,
    createKey,
    initialMembers,
    name,
  );

  const [vault] = getAuthorityPDA(
    multisigAccount.publicKey,
    new BN(1),
    DEFAULT_MULTISIG_PROGRAM_ID,
  );

  const multisigId = multisigAccount.publicKey.toBase58();

  console.log("Create Squad :", multisigId);
  console.log("Create Squad Vault:", vault.toBase58());

  return { multisigId, vault };
};

export const getVault = (squadId: PublicKey | undefined) => {
  if (!squadId) return null;

  const [vault] = getAuthorityPDA(
    squadId,
    new BN(1),
    DEFAULT_MULTISIG_PROGRAM_ID,
  );

  return vault;
};

// export const addMemberToSquad = async (squadId, member) => {
//   const wallet: any = useWallet();

//   const squads = Squads.devnet(wallet, { commitmentOrConfig: "confirmed" });

//   const addMemberInstruction = await squads.

//   const transaction = await txBuilder.
// };
