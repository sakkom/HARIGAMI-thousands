import { useEffect, useState } from "react";

import Squads, {
  DEFAULT_MULTISIG_PROGRAM_ID,
  getAuthorityPDA,
  MultisigAccount,
  Wallet,
} from "@sqds/sdk";
import BN from "bn.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

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
