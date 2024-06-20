import { useState, useEffect } from "react";
import { PublicKey, Umi } from "@metaplex-foundation/umi";
import {
  fetchCandyMachineDetail,
  fetchMetadataViaCollectionMint,
} from "@/utils/candy-machine/fetchAccount";
import { HarigamiDetail } from "@/types/customTypes";

export const useHarigamiDetail = (umi: Umi, candyId: PublicKey) => {
  const [harigamiDetail, setHarigamiDetail] = useState<HarigamiDetail>();

  useEffect(() => {
    if (!candyId) return;

    const fetchDetail = async (): Promise<HarigamiDetail | undefined> => {
      try {
        const candyDetail = await fetchCandyMachineDetail(umi, candyId);

        const collectionMint = candyDetail.collectionMint;

        const { name, image } = await fetchMetadataViaCollectionMint(
          umi,
          collectionMint,
        );

        const itemsAvailable_num = Number(candyDetail.itemsAvaiable);
        const itemsRedeemed_num = Number(candyDetail.itemsRedeemed);

        setHarigamiDetail({
          candyMachineId: candyDetail.candyMachineId,
          collectionMint,
          itemsAvailable_num,
          itemsLoaded: candyDetail.itemsLoaded,
          itemsRedeemed_num,
          coverImage: image,
          title: name,
        });
      } catch (e) {
        return undefined;
      }
    };

    fetchDetail();
  }, [candyId, umi]);

  return harigamiDetail;
};
