import { PublicKey } from "@solana/web3.js";
import Squads, {
  DEFAULT_MULTISIG_PROGRAM_ID,
  getAuthorityPDA,
  TransactionAccount,
} from "@sqds/sdk";
import BN from "bn.js";
import * as web3 from "@solana/web3.js";

export const getVault = (multisigPda: web3.PublicKey) => {
  if (!multisigPda) return null;
  // console.log(multisigPda);

  const [vault] = getAuthorityPDA(
    new web3.PublicKey(multisigPda),
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

export function filterActiveTx(transactions: TransactionAccount[]) {
  return transactions.filter((item) => item.status?.active);
}

export function filterExecuteReadyTx(transactions: TransactionAccount[]) {
  // console.log("foo", transactions);
  return transactions.filter((item) => item.status?.executeReady);
}

export async function approveTxUser(
  wallet: any,
  transactionPda: web3.PublicKey,
) {
  // console.log(txPda);
  const squads = Squads.devnet(wallet, { commitmentOrConfig: "confirmed" });
  const txState = await squads.approveTransaction(transactionPda);
  // console.log("approve,", txState.approved);

  return txState;
}

// export const addMemberToSquad = async (squadId, member) => {
//   const wallet: any = useWallet();

//   const squads = Squads.devnet(wallet, { commitmentOrConfig: "confirmed" });

//   const addMemberInstruction = await squads.

//   const transaction = await txBuilder.
// };
