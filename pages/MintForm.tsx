import { FC, useState, useEffect } from "react";

import { Button } from "@mui/material";
import { Paper } from "@mui/material";
import { mintFromCandyGuard } from "@/utils/candy-machine/createAccount";
import * as web3 from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { postAddMember } from "@/utils/apiUtils";
import { getVault } from "@/utils/squads";
import { PublicKey, Umi } from "@metaplex-foundation/umi";
import { Typography } from "@material-tailwind/react";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

export interface MintProps {
  isMint: boolean;
  umi: Umi;
  candyId: PublicKey;
  collectionId: PublicKey;
  multisigPda: web3.PublicKey | undefined;
}

export const MintForm: FC<MintProps> = ({
  isMint,
  umi,
  candyId,
  collectionId,
  multisigPda,
}) => {
  const wallet = useWallet();
  const publicKey = wallet.publicKey;
  const [error, setError] = useState("");
  umi.use(walletAdapterIdentity(wallet)); //mint

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

    const txState = await postAddMember(multisigPda, publicKey);
    // console.log(res);

    setError("");
  };

  return (
    <>
      {isMint ? (
        <Paper className=" animatedBackground w-full aspect-video flex items-center justify-center">
          <Button onClick={handleSubmit}>Publish</Button>
        </Paper>
      ) : (
        <Paper className=" blackGlassPaper w-full aspect-video flex items-center justify-center">
          <Typography variant="h5">thnks</Typography>
        </Paper>
      )}
    </>
  );
};
