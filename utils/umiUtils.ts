import { mockStorage } from "@metaplex-foundation/umi-storage-mock";
import {
  createGenericFileFromBrowserFile,
  createGenericFileFromJson,
  generateSigner,
  KeypairSigner,
  Umi,
  some,
  sol,
  TransactionBuilderSendAndConfirmOptions,
  PublicKey,
} from "@metaplex-foundation/umi";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  mplCore,
  createCollectionV1,
  fetchCollectionV1,
  CollectionV1,
} from "@metaplex-foundation/mpl-core";
import {
  create,
  mplCandyMachine as mplCoreCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { base58 } from "@metaplex-foundation/umi/serializers";

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

interface MetaData {
  name: string;
  description: string;
  image: string;
  animation_uri?: string;
  external_uri?: string;
  attributes: Attributes[];
  properties?: Properties;
}

const options: TransactionBuilderSendAndConfirmOptions = {
  send: { skipPreflight: true },
  confirm: { commitment: "processed" },
};

export const getImageUri = async (
  umi: any,
  fileList: FileList,
): Promise<string> => {
  umi.use(mockStorage());

  const file: File = fileList[0];
  if (!file) throw new Error("No file provided");

  const genericFile = await createGenericFileFromBrowserFile(file);
  // console.log(genericFile);
  const uriArray = await umi.uploader.upload([genericFile]);
  const uri = uriArray[0];

  return uri;
};

export const getMetaDataUri = async (
  umi: any,
  metaData: MetaData,
): Promise<string> => {
  umi.use(mockStorage());

  const jsonMetadata = JSON.stringify(metaData);
  const genericMetaData = createGenericFileFromJson(jsonMetadata);
  const uriArray = await umi.uploader.upload([genericMetaData]);
  const uri = uriArray[0];

  return uri;
};

export const createCoreCollection = async (
  umi: Umi,
  wallet: WalletContextState,
  uri: string,
): Promise<KeypairSigner> => {
  // if (!wallet.connected) throw new Error("wallet is not connected");
  console.log("collectionを作成します");

  umi.use(walletAdapterIdentity(wallet)).use(mplCore());

  const collectionSigner = generateSigner(umi);

  const { signature } = await createCollectionV1(umi, {
    collection: collectionSigner,
    name: "A Collection",
    uri: uri,
  }).sendAndConfirm(umi);

  const result = await fetchCollectionAsset(umi, collectionSigner.publicKey);
  console.log(`collection asset: ${result}`);
  // const tx = base58.deserialize(signature)[0];
  // console.log(tx);

  return collectionSigner;
};

export const createCandyMachine = async (
  umi: Umi,
  wallet: WalletContextState,
  collectionSigner: KeypairSigner,
): Promise<KeypairSigner> => {
  umi.use(walletAdapterIdentity(wallet)).use(mplCoreCandyMachine());

  console.log("machine作成にとりかかります");

  const candyMachine = generateSigner(umi);

  const createIx = await create(umi, {
    candyMachine,
    collection: collectionSigner.publicKey,
    collectionUpdateAuthority: umi.identity,
    itemsAvailable: 1000,
    authority: umi.identity.publicKey,
    isMutable: true,
    configLineSettings: some({
      prefixName: "Quick NFT #",
      nameLength: 11,
      prefixUri: "https://example.com/metadata/",
      uriLength: 29,
      isSequential: false,
    }),
    guards: {
      botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      // All other guards are disabled...
    },
  });

  const { signature } = await createIx.sendAndConfirm(umi, options);
  // const tx = base58.deserialize(signature)[0];
  // console.log(`candy machineのsignature: ${tx}`);

  return candyMachine;
};

export const fetchCollectionAsset = async (
  umi: Umi,
  address: PublicKey,
): Promise<CollectionV1> => {
  const asset = await fetchCollectionV1(umi, address);
  // console.log(asset);
  return asset;
};
