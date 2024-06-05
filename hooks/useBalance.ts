import { useState, useEffect } from "react";
import { PublicKey, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const useBalance = (
  publicKey: PublicKey | null,
  connection: Connection,
) => {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function updataBalance() {
      if (publicKey) {
        const newBalance = await connection.getBalance(publicKey);
        setBalance(newBalance / LAMPORTS_PER_SOL);
      }
    }

    updataBalance();

    interval = setInterval(updataBalance, 10000);

    return () => clearInterval(interval);
  }, [publicKey, connection]);

  return balance;
};
