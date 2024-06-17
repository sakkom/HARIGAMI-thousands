import { useEffect, useState } from "react";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { getVault } from "@/utils/squads";

export const useVaultBalance = (squadId: PublicKey) => {
  const [balance, setBalance] = useState<any>(0);

  const vault = getVault(squadId);
  if (!vault) throw new Error("not vault account");

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  useEffect(() => {
    const fetchBalance = async () => {
      const accountBalance = await connection.getBalance(vault);
      setBalance(accountBalance / LAMPORTS_PER_SOL);
    };

    fetchBalance();
  }, []);

  return balance;
};
