import { useContext, useEffect, useState } from "react";
import { getVault } from "@/utils/squads";
import * as web3 from "@solana/web3.js";
import Squads, {
  DEFAULT_MULTISIG_PROGRAM_ID,
  getAuthorityPDA,
  MultisigAccount,
  Wallet,
} from "@sqds/sdk";
import BN from "bn.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { fetchProposalsDetail } from "@/utils/squads";

export const useVaultBalance = (squadId: PublicKey) => {
  const [balance, setBalance] = useState<any>(0);
  const [publicKey, setPublicKey] = useState<web3.PublicKey>();

  useEffect(() => {
    if (!squadId) {
      console.log("Squad ID is undefined");
      return;
    }

    const vault = getVault(squadId);
    if (!vault) {
      console.log("Not found vault");
      return;
    }
    setPublicKey(vault);

    const connection = new web3.Connection(
      web3.clusterApiUrl("devnet"),
      "confirmed",
    );

    const fetchBalance = async () => {
      const accountBalance = await connection.getBalance(vault);
      setBalance(accountBalance / web3.LAMPORTS_PER_SOL);
    };

    fetchBalance();
  }, [squadId]);

  return { publicKey, balance };
};

export const useSquadAccount = (squadId: string) => {
  const wallet: any = useWallet();
  const [squadAccount, setSquadAccount] = useState<MultisigAccount>();

  useEffect(() => {
    const fetchSquadAccount = async () => {
      const squads = Squads.devnet(wallet, { commitmentOrConfig: "confirmed" });

      const multisigPublicKey = new PublicKey(squadId);
      const multisigAccount = await squads.getMultisig(multisigPublicKey);
      setSquadAccount(multisigAccount);
    };

    fetchSquadAccount();
  }, [squadId]);

  return squadAccount;
};

export const useProposalsDetail = (
  wallet: any,
  proposals: web3.PublicKey[],
) => {
  const [detail, setDetail] = useState<any[]>([]);

  useEffect(() => {
    if (proposals.length === 0) {
      console.log("Wallet is not set or no proposals provided");
      return;
    }

    console.log("let's go");

    const fetchDetail = async () => {
      const results: any = await fetchProposalsDetail(wallet, proposals);
      console.log(results);
      setDetail(results);
    };

    fetchDetail();
  }, [proposals]);

  return detail;
};
