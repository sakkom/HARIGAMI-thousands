import { useState, useEffect } from "react";
import { publicKey } from "@metaplex-foundation/umi";
import {
  CollectionIdWithCandyMachineId,
  CollectionV1WithCandyMachineId,
  ImageWithCandyMachineId,
} from "@/types/customTypes";
import { Umi } from "@metaplex-foundation/umi";
import {
  fetchCollectionIdViaCandyId,
  fetchCollectionV1WithCandyId,
  fetchMetadataWithCandyMachine,
} from "@/utils/candy-machine/fetchAccount";
import {
  filterCollectionIdWithCandyMachineId,
  filterCollectionV1WithCandyMachineId,
  filterImageWithCandyMachineId,
} from "@/utils/commoUtils";

//Mainly /view
export const useCollectionIds = (
  umi: Umi,
  storeIds: string[],
): CollectionIdWithCandyMachineId[] => {
  const [collectionIds, setCollectionIds] = useState<
    CollectionIdWithCandyMachineId[]
  >([]);

  console.log(storeIds);

  useEffect(() => {
    if (storeIds.length === 0) return;

    const fetchMachines = async () => {
      try {
        const results = await Promise.all(
          storeIds.map(async (id) => {
            return fetchCollectionIdViaCandyId(umi, publicKey(id));
          }),
        );

        const filteredResults = filterCollectionIdWithCandyMachineId(results);

        setCollectionIds(filteredResults);
        // console.log("CandyMachine[]を取得");
      } catch (e) {
        console.log("Error: doesn't work useCandyMachines", e);
      }
    };

    fetchMachines();
  }, [storeIds, umi]);

  return collectionIds;
};

export const useUrisWithCandyMachine = (
  umi: Umi,
  collectionIds: CollectionIdWithCandyMachineId[],
): CollectionV1WithCandyMachineId[] => {
  const [collectionUris, setCollectionUris] = useState<
    CollectionV1WithCandyMachineId[]
  >([]);

  useEffect(() => {
    if (collectionIds.length === 0) return;

    const fetchCollections = async () => {
      try {
        const results = await Promise.all(
          collectionIds.map(async (collectionId) => {
            return fetchCollectionV1WithCandyId(umi, collectionId);
          }),
        );

        const filteredResults = filterCollectionV1WithCandyMachineId(results);

        setCollectionUris(filteredResults);
        // console.log(`CollectionWithCandyMachineId[]を取得`);
      } catch (e) {
        console.log(`Error fetching collections `, e);
      }
    };

    fetchCollections();
  }, [collectionIds, umi]);

  return collectionUris;
};

export const useImagesWithCandyMachine = (
  colsWithCandy: CollectionV1WithCandyMachineId[],
): ImageWithCandyMachineId[] => {
  const [images, setImages] = useState<ImageWithCandyMachineId[]>([]);

  useEffect(() => {
    if (colsWithCandy.length === 0) return;

    const fetchImageUrls = async () => {
      try {
        const results = await Promise.all(
          colsWithCandy.map(async (colWithCandy) => {
            return fetchMetadataWithCandyMachine(colWithCandy);
          }),
        );

        const filteredResults = filterImageWithCandyMachineId(results);

        setImages(filteredResults);
        // console.log("Ok! Collection Images");
      } catch (e) {
        console.log(`Error fetching images`, e);
      }
    };

    fetchImageUrls();
  }, [colsWithCandy]);

  return images;
};
