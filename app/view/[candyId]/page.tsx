"use client";

import { HarigamiInfo } from "@/pages/HarigamiInfo";
import { publicKey } from "@metaplex-foundation/umi";
import { useContext } from "react";
import { UmiContext } from "@/context/UmiProvider";
import { useHarigamiDetail } from "@/hooks/useHarigamiDetail";
import { useWallet } from "@solana/wallet-adapter-react";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useSquadId } from "@/hooks/useStored";
import Link from "next/link";
import { MintForm } from "@/pages/MintForm";
import SavingsIcon from "@mui/icons-material/Savings";
import { Rock_Salt } from "next/font/google";
import { Paper, Typography } from "@mui/material";
import * as web3 from "@solana/web3.js";

const rockSalt = Rock_Salt({ subsets: ["latin"], weight: ["400"] });

export default function Page({ params }: { params: { candyId: string } }) {
  const wallet = useWallet();
  const umi = useContext(UmiContext);
  umi.use(walletAdapterIdentity(wallet));
  const candyId = publicKey(params.candyId);
  const detail = useHarigamiDetail(umi, candyId);
  const collectionId = detail?.collectionMint;

  const squadId = useSquadId(candyId);

  return (
    <>
      {detail && (
        <div className="mobile-like">
          <HarigamiInfo detail={detail} />
          {collectionId && (
            <div className="flex">
              <MintForm
                umi={umi}
                candyId={candyId}
                collectionId={collectionId}
                squadId={squadId}
              />
              <div className="w-full">
                {squadId && (
                  <Link href={`${params.candyId}/${squadId}`}>
                    <Paper className=" aspect-video blackGlassPaper flex justify-center items-center">
                      <SavingsIcon fontSize={"large"} />
                      <div className="flex items-end">aaaa</div>
                    </Paper>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
