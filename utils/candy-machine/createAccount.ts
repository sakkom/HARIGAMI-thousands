import { mockStorage } from "@metaplex-foundation/umi-storage-mock";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  createGenericFileFromBrowserFile,
  createGenericFileFromJson,
  generateSigner,
  KeypairSigner,
  Umi,
  some,
  sol,
  TransactionBuilderSendAndConfirmOptions,
  publicKey,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import { mplCore, createCollectionV1 } from "@metaplex-foundation/mpl-core";
import {
  addConfigLines,
  create,
  mplCandyMachine as mplCoreCandyMachine,
  mintV1,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
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

// interface ExpectedCandyMachineState {
// }

//change for a production environment.
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
  umi.use(walletAdapterIdentity(wallet)).use(mplCore());

  const collectionSigner = generateSigner(umi);

  const { signature } = await createCollectionV1(umi, {
    collection: collectionSigner,
    name: "A Collection",
    uri: uri,
  }).sendAndConfirm(umi);

  const tx = base58.deserialize(signature)[0];
  console.log(`Create Collection! tx: ${tx}`);

  return collectionSigner;
};

export const createCandyMachine = async (
  umi: Umi,
  wallet: WalletContextState,
  collectionSigner: KeypairSigner | null,
): Promise<KeypairSigner> => {
  umi.use(walletAdapterIdentity(wallet)).use(mplCoreCandyMachine());
  if (!collectionSigner) throw Error("collection is null");

  const candyMachineSigner = generateSigner(umi);

  const createIx = await create(umi, {
    candyMachine: candyMachineSigner,
    collection: collectionSigner.publicKey,
    collectionUpdateAuthority: umi.identity,
    itemsAvailable: 10,
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
    },
  });

  const { signature } = await createIx.sendAndConfirm(umi, options);

  const tx = base58.deserialize(signature)[0];
  console.log(
    `Create Candy Machine! tx:  ${tx}\ Candy machine id: ${candyMachineSigner.publicKey}`,
  );

  return candyMachineSigner;
};

export const addItems = async (
  umi: Umi,
  wallet: WalletContextState,
  candyMachine: KeypairSigner,
): Promise<void> => {
  try {
    umi.use(walletAdapterIdentity(wallet)).use(mplCoreCandyMachine());

    await addConfigLines(umi, {
      candyMachine: candyMachine.publicKey,
      index: 0,
      configLines: [
        { name: "1", uri: "1.json" },
        { name: "2", uri: "1.json" },
        { name: "3", uri: "1.json" },
        { name: "4", uri: "1.json" },
        { name: "5", uri: "1.json" },
        { name: "6", uri: "1.json" },
        { name: "7", uri: "1.json" },
        { name: "8", uri: "1.json" },
        { name: "9", uri: "1.json" },
        { name: "10", uri: "1.json" },
      ],
    }).sendAndConfirm(umi, options);

    console.log(`Added items to the Candy Machine: ${candyMachine.publicKey}`);
  } catch (error) {
    console.log("Error adding items to the Candy Machine");
  }
};

export const mintFromCandyGuard = async (
  umi: Umi,
  wallet: WalletContextState,
  // candyMachine: KeypairSigner,
  // corecollection: KeypairSigner,
): Promise<any> => {
  umi.use(walletAdapterIdentity(wallet)).use(mplCoreCandyMachine());

  const assetSigner = generateSigner(umi);

  const coreCollectionId = publicKey(
    "F7xyrbKksrfTjPtv9owxLoF8LgucPTk8kwn8asirbBq6",
  );
  const candyMachineId = publicKey(
    "FYaJC42ArAj5ivCj9beneFSqG3n9mgGrrpt5g8Yf7Fzw",
  );

  const { signature } = await transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add(
      mintV1(umi, {
        candyMachine: candyMachineId,
        asset: assetSigner,
        collection: coreCollectionId,
      }),
    )
    .sendAndConfirm(umi, options);

  console.log(
    `OK! signature: ${base58.deserialize(signature)[0]}\ Asset Id: ${assetSigner.publicKey}`,
  );

  return assetSigner;
};
