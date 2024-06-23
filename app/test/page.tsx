"use client";

import { useContext, useEffect } from "react";
import { UmiContext } from "@/context/UmiProvider";
import { mplCore, fetchAssetsByOwner } from "@metaplex-foundation/mpl-core";
import { publicKey } from "@metaplex-foundation/umi";

export default function Page() {
  const umi = useContext(UmiContext);
  umi.use(mplCore());
  useEffect(() => {
    const fetchAsset = async () => {
      const result = await fetchAssetsByOwner(
        umi,
        publicKey("9eaVFdsmdZcUArXfwR5AT6VSrRwE77TzGGpLe6XxMXR2"),
        {
          skipDerivePlugins: false,
        },
      );
      console.log(result);
    };

    fetchAsset();
  }, []);

  return <h1>foo</h1>;
}
