"use client";

import {
  addMemberSquad,
  createHarigamiSquad,
  getMultisigDetail,
  getMsTransaction,
  activeTransaction,
  approveTransaction,
  executeTx,
  transferMember,
  getVault,
} from "@/action/HarigamiSquad";
import { Button } from "@material-tailwind/react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Page() {
  const wallet = useWallet();

  const handleSquad = async () => {
    if (wallet.connected) {
      // await createHarigamiSquad(wallet);
      // await getMultisigDetail(wallet);
      // await addMemberSquad(wallet);
      // await getMsTransaction(wallet);
      // await activeTransaction(wallet);
      // await approveTransaction(wallet);
      // await executeTx(wallet);
      // await transferMember(wallet);
      getVault(wallet);
    } else {
      console.log("wallet null");
    }
  };

  return <Button onClick={handleSquad}>Create Multisig Wallet</Button>;
}
