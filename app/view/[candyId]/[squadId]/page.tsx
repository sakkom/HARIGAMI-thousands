"use client";
import { FC } from "react";
import * as web3 from "@solana/web3.js";
import { Paper, Typography } from "@mui/material";
import { useSquadAccount } from "@/hooks/useSquad";
import { useVaultBalance } from "@/hooks/useBalance";

export default function Page({ params }: { params: { squadId: string } }) {
  const squadId = params.squadId;

  const squadAccount = useSquadAccount(squadId);

  const holder = squadAccount?.keys;

  return (
    <div className="flex ">
      <Holder holder={holder} />
      <Vault squadId={squadId} />
      {/* <Proposal /> */}
    </div>
  );
}

interface HolderProps {
  holder: web3.PublicKey[] | undefined;
}

const Holder: FC<HolderProps> = ({ holder }) => {
  return (
    <div>
      <Paper className="blackGlassPaper">
        <Typography variant="h1">Holder</Typography>
        {holder?.map((item, index) => (
          <Typography variant="h5" key={index}>
            {item.toBase58()}
          </Typography>
        ))}
      </Paper>
    </div>
  );
};

interface VaultProps {
  squadId: string;
}

const Vault: FC<VaultProps> = ({ squadId }) => {
  const squadId_pubKey = new web3.PublicKey(squadId);

  const vaultBalance = useVaultBalance(squadId_pubKey);

  return (
    <div>
      <Paper className="blackGlassPaper">
        <Typography variant="h1">Vault</Typography>
        {vaultBalance && <p>{vaultBalance}</p>}
      </Paper>
    </div>
  );
};
