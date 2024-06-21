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
  const [balanceSol, setBalanceSol] = useState<any>(0);
  const [balanceUsd, setBalanceUsd] = useState<any>(0);
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
        multisigPda,
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
  const [msPda, setMsPda] = useState<web3.PublicKey>();
  const [threshold, setThreshold] = useState<string>();
  const [members, setMembers] = useState<web3.PublicKey[]>([]);

  useEffect(() => {
    const fetchMsAccount = async () => {
      const res = await fetch(`http://localhost:3000/api/get/${multisigPda}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch`);
      }

      let data = await res.json();
      setMsPda(new web3.PublicKey(data.publicKey));
      setThreshold(data.threshold);
      setMembers(data.keys.map((item: string) => new web3.PublicKey(item)));
    };

    if (multisigPda) {
      fetchMsAccount();
    }
  }, [multisigPda]);

  return { msPda, threshold, members };
};

export const useTxAccounts = (txPdas: string[]) => {
  const [txAccounts, setTxAccounts] = useState<TransactionAccount[]>([]);

  useEffect(() => {
    const fetchTxAccounts = async () => {
      try {
        const results = await Promise.all(
          txPdas.map(async (txPda) => {
            const res = await fetch(
              `http://localhost:3000/api/get/txAccount/${txPda}`,
            );
            // console.log(res.json());

            return res.json() as Promise<TransactionAccount>;
          }),
        );
        console.log(results);
        setTxAccounts(results);
      } catch (e) {
        console.error("Failed to fetch", e);
      }
    };

    if (txPdas.length > 0) {
      fetchTxAccounts();
    }
  }, [txPdas]);

  return txAccounts;
};
