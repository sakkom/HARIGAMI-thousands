"use client";

import { UmiContext } from "@/context/UmiProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { useContext, useEffect, useState } from "react";
import { fetchAssetsByOwner, AssetV1 } from "@metaplex-foundation/mpl-core";
import { PublicKey, publicKey } from "@metaplex-foundation/umi";
import { Typography } from "@mui/material";
import { fetchImageUrl } from "../collection/page";
import { TiltPaper } from "@/components/TiltPaper";
import { Paper } from "@mui/material";
import { useStoredHarigamiCollection } from "@/hooks/useStored";
import Link from "next/link";

type AssetView = {
  address: PublicKey;
  collection: PublicKey | undefined;
  name: string;
  imgUrl: string;
};

export default function Page() {
  const wallet = useWallet();
  const viewr = wallet.publicKey;
  const umi = useContext(UmiContext);
  const harigamiCollection: string[] = useStoredHarigamiCollection();

  const [assets, setAssets] = useState<AssetV1[]>([]);
  const [contents, setContents] = useState<AssetView[]>([]);

  useEffect(() => {
    if (assets.length === 0) return;

    const setDetail = async () => {
      const results = await Promise.all(
        assets.map(async (asset) => {
          const address = asset.publicKey;
          const collection = asset.updateAuthority.address;
          const name = asset.name;
          const imgUrl = await fetchImageUrl(asset.uri);

          return { address, collection, name, imgUrl };
        }),
      );
      // console.log("foofoo", results);
      setContents(results);
    };

    setDetail();
  }, [assets]);

  useEffect(() => {
    if (!viewr || harigamiCollection.length === 0) return;

    const fetchAsset = async () => {
      const result = await fetchAssetsByOwner(umi, publicKey(viewr), {
        skipDerivePlugins: false,
      });

      const harigamiAssets = result.filter((element) =>
        harigamiCollection.includes(
          element.updateAuthority.address?.toString() ?? "",
        ),
      );

      setAssets(harigamiAssets);
    };

    fetchAsset();
  }, [viewr, harigamiCollection]);

  return (
    <>
      {viewr ? (
        contents?.map((asset, index) => (
          <div key={index} className="mobile-like">
            <Link href={`/collection/${asset.collection}`}>
              <Typography variant="h4">{asset.name}</Typography>

              <Paper className="animatedBackground">
                <TiltPaper key={index} imgUrl={asset.imgUrl} index={index} />
              </Paper>
              <Link
                href={`https://core.metaplex.com/explorer/${asset.address}?env=devnet`}
              >
                <Typography variant="body1" color={"pink"}>
                  https://core.metaplex.com/explorer/
                </Typography>
              </Link>
            </Link>
          </div>
        ))
      ) : (
        <Typography>conect wallet</Typography>
      )}
    </>
  );
}
