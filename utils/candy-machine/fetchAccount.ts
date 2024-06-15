import { PublicKey, Umi } from "@metaplex-foundation/umi";
import {
  CollectionIdWithCandyMachineId,
  CollectionV1WithCandyMachineId,
  ImageWithCandyMachineId,
  CandyMachineDetail,
} from "@/types/customTypes";
import { fetchCandyMachine } from "@metaplex-foundation/mpl-core-candy-machine";
import { fetchCollectionV1 } from "@metaplex-foundation/mpl-core";
import { MetaData } from "@/types/cutomInterface";

export const fetchMetadataWithCandyMachine = async (
  colWithCandy: CollectionV1WithCandyMachineId,
): Promise<ImageWithCandyMachineId | undefined> => {
  try {
    const responce = await fetch(colWithCandy.collectionV1.uri);
    // console.log(result);
    const data = await responce.json();
    return {
      coverImage: data.image,
      candyMachineId: colWithCandy.candyMachineId,
    };
  } catch (e) {
    console.log(
      `Error fetching image uri with collection uri: ${colWithCandy.collectionV1.uri}`,
      e,
    );
    return undefined;
  }
};

export const fetchMetadataViaCollectionMint = async (
  umi: Umi,
  collectionMint: PublicKey,
): Promise<{ name: string; image: string }> => {
  const { name, uri } = await fetchCollectionV1(umi, collectionMint);

  const res = await fetch(uri);
  const data: MetaData = await res.json();
  const image = data.image;

  return { name, image }; //onchain name offchain image
};

export const fetchCollectionIdViaCandyId = async (
  umi: Umi,
  candyId: PublicKey,
): Promise<CollectionIdWithCandyMachineId | undefined> => {
  try {
    const { collectionMint } = await fetchCandyMachine(umi, candyId);

    return { collectionMint, candyMachineId: candyId };
  } catch (e) {
    console.log(`Error fetching Candy Machine with id ${candyId}`, e);
    return undefined;
  }
};

export const fetchCollectionV1WithCandyId = async (
  umi: Umi,
  collectionId: CollectionIdWithCandyMachineId,
): Promise<CollectionV1WithCandyMachineId | undefined> => {
  try {
    const { name, uri } = await fetchCollectionV1(
      umi,
      collectionId.collectionMint,
    );

    return {
      collectionV1: { name, uri },
      candyMachineId: collectionId.candyMachineId,
    };
  } catch (e) {
    console.log(
      `Error fetching collection with id: ${collectionId.collectionMint}`,
      e,
    );
    return undefined;
  }
};

export const fetchCandyMachineDetail = async (
  umi: Umi,
  candyId: PublicKey,
): Promise<CandyMachineDetail> => {
  const { publicKey, collectionMint, data, itemsLoaded, itemsRedeemed } =
    await fetchCandyMachine(umi, candyId);

  const itemsAvaiable = data.itemsAvailable;

  return {
    candyMachineId: publicKey,
    collectionMint,
    itemsAvaiable,
    itemsLoaded,
    itemsRedeemed,
  };
};
