"use client";

import { useStoredCollectionIds } from "@/hooks/useStored";
import {
  fetchCollection,
  CollectionV1,
  mplCore,
} from "@metaplex-foundation/mpl-core";
import { useEffect, useState, useContext } from "react";
import { UmiContext } from "@/context/UmiProvider";
import { PublicKey, publicKey } from "@metaplex-foundation/umi";
import Masonry from "@mui/lab/Masonry";
import Link from "next/link";
import { TiltPaper } from "@/components/TiltPaper";
import { Paper } from "@mui/material";
import { Typography } from "@material-tailwind/react";

export type ImageView = {
  address: PublicKey;
  imageUrl: string;
};

export default function Page() {
  const umi = useContext(UmiContext);
  umi.use(mplCore());

  const collectionIds: string[] = useStoredCollectionIds();

  // const collections: CollectionV1[] =
  const [collections, setCollections] = useState<CollectionV1[]>([]);
  const [colsView, setColsView] = useState<ImageView[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      if (collectionIds.length > 0) {
        const results = await Promise.all(
          collectionIds.map(async (address) => {
            const result = await fetchCollection(umi, publicKey(address));
            return result;
          }),
        );
        // console.log("foo", results);
        setCollections(results);
      } else {
        return;
      }
    };

    fetchCollections();
  }, [collectionIds]);

  useEffect(() => {
    const fetchImgUrls = async () => {
      if (collections.length > 0) {
        const results = await Promise.all(
          collections.map(async (col) => {
            const address = col.publicKey;
            const imageUrl = await fetchImageUrl(col.uri);

            return { address, imageUrl };
          }),
        );
        // console.log("foofoo", results);
        setColsView(results);
      } else {
        return;
      }
    };

    fetchImgUrls();
  }, [collections]);

  return (
    <div className="mobile-like">
      <Masonry columns={2} spacing={1}>
        <Link href={"/form"}>
          <Paper className="aspect-square animatedBackground">
            <Typography variant="h4">create</Typography>
          </Paper>
        </Link>

        {colsView?.map((item, index) => (
          <Link key={index} href={`/collection/${item.address}`}>
            <TiltPaper key={index} imgUrl={item.imageUrl} index={index} />
          </Link>
        ))}
      </Masonry>
    </div>
  );
}

export async function fetchImageUrl(uri: string) {
  const res = await fetch(uri);
  const data = await res.json();
  const imageUrl = data.image;

  return imageUrl;
}
