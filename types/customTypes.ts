import { PublicKey } from "@metaplex-foundation/umi";
import * as web3 from "@solana/web3.js";

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

export type MultisigAccount = {
  approved: web3.PublicKey[];
  authorityBump: number;
  authorityIndex: number;
  bump: number;
  cancelled: web3.PublicKey[];
  creator: web3.PublicKey;
  executedIndex: number;
  instructionIndex: number;
  ms: web3.PublicKey;
  publicKey: web3.PublicKey;
  rejected: web3.PublicKey[];
  status: {
    active?: any;
    executeReady?: any;
  };
  transactionIndex: number;
};
