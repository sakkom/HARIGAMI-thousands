import { PublicKey } from "@solana/web3.js";
import Squads, {
  DEFAULT_MULTISIG_PROGRAM_ID,
  getAuthorityPDA,
} from "@sqds/sdk";
import BN from "bn.js";
import * as web3 from "@solana/web3.js";
import { TransactionDetail } from "@/types/customTypes";

export const getVault = (squadId: PublicKey | undefined) => {
  if (!squadId) return null;

  const [vault] = getAuthorityPDA(
    squadId,
    new BN(1),
    DEFAULT_MULTISIG_PROGRAM_ID,
  );

  return vault;
};

export const fetchProposalsDetail = async (
  wallet: any,
  transactionPda: web3.PublicKey[],
) => {
  try {
    const squads = Squads.devnet(wallet, { commitmentOrConfig: "confirmed" });

    const transactions = await squads.getTransactions(transactionPda);
    // console.log(transactions);
    return transactions;
  } catch (e) {
    console.error("not fetch proposals detail", e);
  }
};

export function filterActiveOrReadyTransactions(
  transactions: TransactionDetail[],
) {
  return transactions.filter(
    (item) => item.status?.active || item.status?.executeReady,
  );
}

// export const addMemberToSquad = async (squadId, member) => {
//   const wallet: any = useWallet();

//   const squads = Squads.devnet(wallet, { commitmentOrConfig: "confirmed" });

//   const addMemberInstruction = await squads.

//   const transaction = await txBuilder.
// };
