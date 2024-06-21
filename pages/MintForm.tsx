import { FC, useState, useEffect } from "react";

import { Button } from "@mui/material";
import { Paper } from "@mui/material";
import { mintFromCandyGuard } from "@/utils/candy-machine/createAccount";
import { MintProps } from "@/types/cutomInterface";
import * as web3 from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { postAddMember } from "@/utils/apiUtils";
import { getVault } from "@/utils/squads";

export const MintForm: FC<MintProps> = ({
  umi,
  candyId,
  collectionId,
  multisigPda,
}) => {
  const wallet = useWallet();
  const publicKey = wallet.publicKey;
  const [error, setError] = useState("");

  useEffect(() => {
    if (!multisigPda) {
      setError("not found squadId");
    } else if (!publicKey) {
      setError("not found member public key");
    }
  }, [multisigPda, publicKey]);

  const handleSubmit = async () => {
    if (!multisigPda || !publicKey) {
      setError("Id is missing ");
      return;
    }

    const vault = getVault(multisigPda);
    if (!vault) throw new Error("not vault account");

    await mintFromCandyGuard(umi, candyId, collectionId, vault);

    const res = await postAddMember(multisigPda, publicKey);
    console.log(res);

    setError("");
  };

  return (
    <Paper className=" animatedBackground w-full aspect-video flex items-center justify-center">
      <Button onClick={handleSubmit}>Mint</Button>
    </Paper>
  );
};
