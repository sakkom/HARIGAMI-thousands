"use client";

import { publicKey } from "@metaplex-foundation/umi";
import { FC, useContext, useEffect, useState } from "react";
import { UmiContext } from "@/context/UmiProvider";
import { useStoredCandyId, useStoredMsId } from "@/hooks/useStored";
import Link from "next/link";
import { MintForm } from "@/pages/MintForm";
import SavingsIcon from "@mui/icons-material/Savings";
import { Rock_Salt } from "next/font/google";
import { Button, Paper, Typography } from "@mui/material";
import * as web3 from "@solana/web3.js";
import {
  CandyMachine,
  fetchCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { fetchCollection, CollectionV1 } from "@metaplex-foundation/mpl-core";
import { fetchImageUrl } from "../page";
import { ScrambleText } from "@/components/ScrambleText";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";

const rockSalt = Rock_Salt({ subsets: ["latin"], weight: ["400"] });

export default function Page({ params }: { params: { address: string } }) {
  const [candymachine, setCandymachine] = useState<CandyMachine>();
  const [collection, setCollection] = useState<CollectionV1>();
  const [imgUrl, setImgUrl] = useState<string>();
  const [isMint, setIsMint] = useState<boolean>(true);

  const umi = useContext(UmiContext);

  const collectionId = params.address;
  const candyId = useStoredCandyId(collectionId);
  const multisigId = useStoredMsId(collectionId);

  useEffect(() => {
    if (!collection) return;

    const fetchImgUrl = async () => {
      const res = await fetchImageUrl(collection.uri);
      setImgUrl(res);
    };

    fetchImgUrl();
  }, [collection]);

  useEffect(() => {
    if (!collectionId) return;

    const fetchCol = async () => {
      const res = await fetchCollection(umi, publicKey(collectionId));
      setCollection(res);
    };

    fetchCol();
  }, [collectionId]);

  useEffect(() => {
    if (!candyId) return;

    const fetchCm = async () => {
      const res = await fetchCandyMachine(umi, publicKey(candyId));
      // console.log("foofoo", res);
      setCandymachine(res);
    };

    fetchCm();
  }, [candyId]);

  useEffect(() => {
    if (!candymachine) return;

    const available = Number(candymachine.data.itemsAvailable);
    const redeemed = Number(candymachine.itemsRedeemed);
    if (available === redeemed) {
      setIsMint(false);
    }
  }, [candymachine]);

  return (
    <>
      <div className="mobile-like">
        <Button className="instgramBackground flex  gap-1 items-center text-black">
          <InstagramIcon />
          <Typography variant="body1">distribute</Typography>
        </Button>
      </div>
      {candymachine && collection ? (
        <div className="mobile-like mt-3">
          {/* <CollectionExplorer /> */}
          <ItemAvailable
            itemsAvailable_num={Number(candymachine.data.itemsAvailable)}
            itemsRedeemed_num={Number(candymachine.itemsRedeemed)}
          />
          {imgUrl && <CollectionInfo title={collection.name} imgUrl={imgUrl} />}

          {multisigId && (
            <div className="flex">
              <MintForm
                isMint={isMint}
                umi={umi}
                candyId={candymachine.publicKey}
                collectionId={collection.publicKey}
                multisigPda={new web3.PublicKey(multisigId)}
              />
              <div className="w-full">
                <Link href={`/collection/${params.address}/${multisigId}`}>
                  <Paper className=" aspect-video blackGlassPaper flex justify-center items-center">
                    <SavingsIcon fontSize={"large"} />
                    <div className="flex items-end">dao</div>
                  </Paper>
                </Link>
              </div>
            </div>
          )}

          <div className="my-5">
            <div className="flex flex-col ">
              <Typography variant="body1">Core Collection</Typography>

              <div>
                <Link
                  href={`https://explorer.solana.com/address/${collection.publicKey}?cluster=devnet`}
                >
                  <Typography variant="body1" color={"pink"}>
                    https://explorer.solana.com/
                  </Typography>
                </Link>
                <Link
                  href={`https://core.metaplex.com/explorer/collection/${collection.publicKey}?env=devnet`}
                >
                  <Typography variant="body1" color={"pink"}>
                    https://core.metaplex.com/explorer/
                  </Typography>
                </Link>
              </div>

              <Typography variant="body1">Candymachine</Typography>
              <Link
                href={`https://explorer.solana.com/address/${candymachine.publicKey}?cluster=devnet`}
              >
                <Typography variant="body1" color={"pink"}>
                  https://explorer.solana.com/
                </Typography>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full  min-h-screen-minus-48 flex justify-center items-center">
          <Typography>loading...</Typography>
        </div>
      )}
    </>
  );
}

interface CollectionInfoProps {
  title: string;
  imgUrl: string;
}

const CollectionInfo: FC<CollectionInfoProps> = ({ title, imgUrl }) => {
  return (
    <div>
      {imgUrl && (
        <div className="blackGlassPaper w-full aspect-square overflow-hidden flex justify-center p-5 ">
          <img src={imgUrl} className="object-contain " />
        </div>
      )}

      <Paper className="blackGlassPaper">
        <ScrambleText
          textInput={title}
          variant="h2"
          className={rockSalt.className}
          scramble={5}
        />

        <Typography variant="body1">
          Bacon ipsum dolor amet consequat nostrud capicola t-bone pork chop,
          sed corned beef flank sausage excepteur. Fatback pork aliqua filet
          mignon, frankfurter ad culpa. T-bone tongue shankle dolor. Ullamco eu
          fatback, filet mignon bacon excepteur id quis dolor jerky beef
          frankfurter minim burgdoggen. Swine chicken leberkas ad ullamco tail
          cow meatball biltong commodo quis deserunt qui officia aute. Leberkas
          nulla ut magna beef consequat est jerky rump esse flank. Spare ribs
          ipsum adipisicing chislic corned beef fatback strip steak, do esse
          picanha leberkas bacon magna kielbasa.
        </Typography>
      </Paper>
    </div>
  );
};

interface ItemAvailableProps {
  itemsAvailable_num: number;
  itemsRedeemed_num: number;
}

const ItemAvailable: FC<ItemAvailableProps> = ({
  itemsAvailable_num,
  itemsRedeemed_num,
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-1">
        <Typography variant="h6">available</Typography>
        <Typography variant="h6">{itemsAvailable_num.toString()}</Typography>
      </div>

      <div className="flex gap-1 items-end">
        <Typography variant="h6">published</Typography>
        <LocalPrintshopOutlinedIcon fontSize={"large"} />
        <ScrambleText
          textInput={itemsRedeemed_num.toString()}
          variant="h6"
          scramble={25}
        />
      </div>
    </div>
  );
};
