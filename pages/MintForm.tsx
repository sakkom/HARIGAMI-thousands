import { FC, useState, useEffect } from "react";

import { Button } from "@mui/material";
import { Paper } from "@mui/material";
import { mintFromCandyGuard } from "@/utils/candy-machine/createAccount";
import { MintProps } from "@/types/cutomInterface";
import { getVault } from "@/utils/squads";
import * as web3 from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { storeProposal } from "@/utils/storeUtils";

export const MintForm: FC<MintProps> = ({
  umi,
  candyId,
  collectionId,
  squadId,
}) => {
  const wallet = useWallet();
  const publicKey = wallet.publicKey;
  const [error, setError] = useState("");

  useEffect(() => {
    if (!squadId) {
      setError("not found squadId");
    } else if (!publicKey) {
      setError("not found member public key");
    }
  }, [squadId, publicKey]);

  const handleSubmit = async () => {
    if (!squadId || !publicKey) {
      setError("Id is missing ");
      return;
    }

    const vault = getVault(squadId);
    if (!vault) throw new Error("not vault account");
    await mintFromCandyGuard(umi, candyId, collectionId, vault);

    setError("");
  };

  return (
    <Paper className=" animatedBackground w-full aspect-video flex items-center justify-center">
      <Button onClick={handleSubmit}>Mint</Button>
    </Paper>
  );
};
