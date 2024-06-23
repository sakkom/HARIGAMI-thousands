"use client";
import { FC, useEffect, useState } from "react";
import * as web3 from "@solana/web3.js";
import { Typography } from "@mui/material";
import { useMultisigAccount } from "@/hooks/useDao";
import Link from "next/link";
import { MultisigAccount } from "@sqds/sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { getVault } from "@/utils/squads";
import { DaoOverview } from "@/pages/dao/DaoOverview";
import { Settlement } from "@/pages/dao/Settlement";
import { Validater } from "@/pages/dao/Validater";

export default function Page({ params }: { params: { msId: string } }) {
  const multisigPda = params.msId;
  const { publicKey } = useWallet();

  const initialMsState: MultisigAccount | undefined =
    useMultisigAccount(multisigPda);

  const [msState, setMsState] = useState<MultisigAccount>();
  const [isMember, setIsMember] = useState<boolean>(false);

  useEffect(() => {
    setMsState(initialMsState);
  }, [initialMsState]);

  useEffect(() => {
    if (publicKey && msState?.keys) {
      const isMemberCheck = msState.keys.some(
        (member) => member.toString() === publicKey.toBase58(),
      );
      setIsMember(isMemberCheck);
    }
  }, [publicKey, msState]);

  return (
    <div className="flex flex-col mobile-like">
      {msState && (
        <div>
          <DaoOverview msState={msState} />
          <Validater msState={msState} />
          {publicKey && (
            <Settlement
              msState={msState}
              isMember={isMember}
              viewer={publicKey}
            />
          )}
          <DaoExplorer msPda={msState.publicKey} />
        </div>
      )}
    </div>
  );
}

interface DaoExplorerProps {
  msPda: web3.PublicKey;
}

const DaoExplorer: FC<DaoExplorerProps> = ({ msPda }) => {
  const vault = getVault(msPda);

  return (
    <div>
      <div className="flex gap-5">
        <Typography variant="body1">Squads App</Typography>
        <Link href={`https://devnet.squads.so/squads`}>
          <Typography variant="body1" color={"pink"}>
            https://devnet.squads.so/squads
          </Typography>
        </Link>
      </div>
      {msPda && (
        <Link href={`https://solana.fm/address/${msPda}/transactions`}>
          <div className="flex gap-5">
            <Typography variant="body1">Multisig Account</Typography>
            <Typography variant="body1" color={"pink"}>
              https://solana.fm/address/
            </Typography>
          </div>
        </Link>
      )}
      {vault && (
        <Link href={`https://solana.fm/address/${vault}/transactions`}>
          <div className="flex gap-5">
            <Typography variant="body1">Vault Account</Typography>
            <Typography variant="body1" color={"pink"}>
              https://solana.fm/address/
            </Typography>
          </div>
        </Link>
      )}
    </div>
  );
};
