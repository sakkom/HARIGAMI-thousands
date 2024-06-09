import { useState, useEffect } from "react";
import {
  CandyMachine,
  fetchCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { publicKey, PublicKey } from "@metaplex-foundation/umi";
import { useUmiRpc } from "./useUmi";
import { CollectionV1, fetchCollectionV1 } from "@metaplex-foundation/mpl-core";

export const useCandyMachines = (ids: string[]): CandyMachine[] => {
  const [machines, setMachines] = useState<CandyMachine[]>([]);
  const umiRpc = useUmiRpc();

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              const machine = await fetchCandyMachine(umiRpc, publicKey(id));
              // console.log(machine);
              return machine;
            } catch (e) {
              console.log(`Error fetching Candy Machine with id ${id}`, e);
              return undefined;
            }
          }),
        );

        const filterResults = results.filter(
          (machine): machine is CandyMachine => machine !== undefined,
        );

        setMachines(filterResults);
        console.log("CandyMachine[]を取得");
      } catch (e) {
        console.log("Error: doesn't work useCandyMachines", e);
      }
    };

    if (ids.length > 0) {
      fetchMachines();
    }
  }, [ids]);

  return machines;
};

export const useCollections = (
  candyMachines: CandyMachine[],
): CollectionV1[] => {
  const umiRpc = useUmiRpc();
  const [collection, setCollection] = useState<CollectionV1[]>([]);

  const collectionIds = candyMachines.map((machine) => {
    return machine.collectionMint;
  });

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const results = await Promise.all(
          collectionIds.map(async (id) => {
            try {
              const collection = await fetchCollectionV1(umiRpc, publicKey(id));
              // console.log(collection);
              return collection;
            } catch (e) {
              console.log(`Error fetching collection with id: ${id}`, e);
              return undefined;
            }
          }),
        );

        const filterResults = results.filter(
          (col): col is CollectionV1 => col !== undefined,
        );

        setCollection(filterResults);
        console.log(`CollectionV1[]を取得`);
      } catch (e) {
        console.log(`Error fetching collections `, e);
      }
    };

    if (collectionIds.length > 0) {
      fetchCollections();
    }
  }, [candyMachines]);

  return collection;
};

export const useCollectionImages = (collections: CollectionV1[]): string[] => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      const results = await Promise.all(
        collections.map(async (col) => {
          try {
            const responce = await fetch(col.uri);
            // console.log(result);
            const data = await responce.json();
            return data.image;
          } catch (e) {
            console.log(
              `Error fetching image uri with collection uri: ${col.uri}`,
              e,
            );
            return undefined;
          }
        }),
      );

      const filterResults = results.filter(
        (imageUri): imageUri is string => imageUri !== undefined,
      );

      setImages(filterResults);
      // console.log("Ok! Collection Images");
    };

    if (collections.length > 0) {
      fetchImageUrls();
    }
  }, [collections]);

  return images;
};
