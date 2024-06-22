import { useContext, useEffect, useState } from "react";
// import { getVault } from "@/utils/squads";
import * as web3 from "@solana/web3.js";
import {
  DEFAULT_MULTISIG_PROGRAM_ID,
  getAuthorityPDA,
  MultisigAccount,
  TransactionAccount,
} from "@sqds/sdk";
import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";
import { fetchProposalsDetail } from "@/utils/squads";

export const useVaultBalance = (multisigPda: PublicKey) => {
  const [balanceSol, setBalanceSol] = useState<number>(0);
  const [balanceUsd, setBalanceUsd] = useState<number>(0);
  const [vaultPda, setVaultPda] = useState<web3.PublicKey>();

  useEffect(() => {
    if (!multisigPda) {
      console.log("Squad ID is undefined");
      return;
    }

    const fetchBalance = async () => {
      const connection = new web3.Connection(
        web3.clusterApiUrl("devnet"),
        "confirmed",
      );

      if (!multisigPda) return null;

      const [vault] = getAuthorityPDA(
        new web3.PublicKey(multisigPda),
        new BN(1),
        DEFAULT_MULTISIG_PROGRAM_ID,
      );
      setVaultPda(vault);

      const accountBalance = await connection.getBalance(vault);
      setBalanceSol(accountBalance / web3.LAMPORTS_PER_SOL);
      setBalanceUsd((accountBalance / web3.LAMPORTS_PER_SOL) * 150);
    };

    fetchBalance();
  }, [multisigPda]);

  return { vaultPda, balanceSol, balanceUsd };
};

export const useMultisigAccount = (multisigPda: string) => {
  const [msState, setMsState] = useState<MultisigAccount>();

  useEffect(() => {
    const fetchMsAccount = async () => {
      const res = await fetch(`http://localhost:3000/api/get/${multisigPda}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch`);
      }

      const data = await res.json();
      const msState = data.msState as MultisigAccount;
      setMsState(msState);
    };

    if (multisigPda) {
      fetchMsAccount();
    }
  }, [multisigPda]);

  return msState;
};

export const useTxAccounts = (txPdas: string[]) => {
  const [txStates, setTxStates] = useState<TransactionAccount[]>([]);

  useEffect(() => {
    const fetchTxAccounts = async () => {
      try {
        const results = await Promise.all(
          txPdas.map(async (txPda) => {
            const res = await fetch(
              `http://localhost:3000/api/get/txAccount/${txPda}`,
            );
            // console.log(res.json());
            const data = await res.json();
            const txState = data.txState as TransactionAccount;
            console.log("foofoo", txState);
            return txState;
          }),
        );
        // console.log(results);
        setTxStates(results);
      } catch (e) {
        console.error("Failed to fetch", e);
      }
    };

    if (txPdas.length > 0) {
      fetchTxAccounts();
    }
  }, [txPdas]);

  return txStates;
};
