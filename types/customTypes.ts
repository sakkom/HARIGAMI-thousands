import { PublicKey } from "@metaplex-foundation/umi";

export type CollectionIdWithCandyMachineId = {
  collectionMint: PublicKey;
  candyMachineId: PublicKey;
};

export type CollectionV1WithCandyMachineId = {
  collectionV1: { name: string; uri: string };
  candyMachineId: PublicKey;
};

export type ImageWithCandyMachineId = {
  coverImage: string;
  candyMachineId: PublicKey;
};

export type CandyMachineDetail = {
  candyMachineId: PublicKey;
  collectionMint: PublicKey;
  itemsAvaiable: bigint;
  itemsLoaded: number;
  itemsRedeemed: bigint;
};

export type HarigamiDetail = {
  candyMachineId: PublicKey;
  collectionMint: PublicKey;
  itemsAvailable_num: number;
  itemsLoaded: number;
  itemsRedeemed_num: number;
  coverImage: string;
  title: string;
};
