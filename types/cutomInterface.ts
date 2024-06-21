import * as web3 from "@solana/web3.js";
import { Umi, PublicKey } from "@metaplex-foundation/umi";
import { CollectionIdWithCandyMachineId } from "./customTypes";

interface Attributes {
  trait_type?: string;
  value?: string;
}

interface Properties {
  files?: AttachedFile[];
  category: string;
}

interface AttachedFile {
  uri?: string;
  type?: string;
  cdn?: boolean;
}

export interface MetaData {
  name: string;
  description: string;
  image: string;
  animation_url?: string;
  external_url?: string;
  attributes: Attributes[];
  properties?: Properties;
}

export interface ViewProps {
  umi: Umi;
  collectionIds: CollectionIdWithCandyMachineId[];
}

export interface MintProps {
  umi: Umi;
  candyId: PublicKey;
  collectionId: PublicKey;
  multisigPda: web3.PublicKey | undefined;
}
