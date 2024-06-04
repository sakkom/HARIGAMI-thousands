//0604 mockStorage -> arwearve
//0604 generic型からuriを作成する同じ関数をリファクタリング
import { useState, useEffect } from "react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mockStorage } from "@metaplex-foundation/umi-storage-mock";
// import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { PreviewPaper } from "@/components/PreviewPaper";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@material-tailwind/react";
import {
  createGenericFileFromBrowserFile,
  createGenericFileFromJson,
  generateSigner,
} from "@metaplex-foundation/umi";
import {
  useConnection,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplCore, createCollection } from "@metaplex-foundation/mpl-core";

type Inputs = {
  image: FileList | null;
};

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

const devnet = "https://api.devnet.solana.com";
// generic型からuriを作成する同じ関数をリファクタリング
const uploader = async (fileList: FileList): Promise<string> => {
  const umi = createUmi("https://api.devnet.solana.com").use(mockStorage());
  const file: File = fileList[0];
  if (!file) throw new Error("No file provided");

  const genericFile = await createGenericFileFromBrowserFile(file);
  // console.log(genericFile);

  const uriArray = await umi.uploader.upload([genericFile]);
  const uri = uriArray[0];

  return uri;
};

const uploadMetaData = async (metaData: MetaData): Promise<string> => {
  const umi = createUmi("https://api.devnet.solana.com").use(mockStorage());
  const jsonMetadata = JSON.stringify(metaData);
  const genericMetaData = createGenericFileFromJson(jsonMetadata);
  const uriArray = await umi.uploader.upload([genericMetaData]);
  const uri = uriArray[0];

  return uri;
};

const createAssetAccount = async (
  wallet: WalletContextState,
  uri: string,
): Promise<void> => {
  if (!wallet.connected) throw new Error("wallet is not connected");

  console.log("collectionを作成します");

  const umi = createUmi(devnet)
    .use(walletAdapterIdentity(wallet))
    .use(mplCore());

  const collectionSigner = generateSigner(umi);

  let { signature } = await createCollection(umi, {
    collection: collectionSigner,
    name: "A Collection",
    uri: uri,
  }).sendAndConfirm(umi);
  // const base64str = Buffer.from(signature).toString("base64");
  // console.log(`check!: ${base64str}`);
};

const createMetaData = (imageUri: string): MetaData => {
  const metaData: MetaData = {
    name: "DAIZU",
    description: "xxxxxxxxxx",
    image: imageUri,
    attributes: [{ trait_type: "traia1", value: "value1" }],
    properties: {
      category: "harigami",
    },
  };

  return metaData;
};

export const CandyMachine = () => {
  const { register, handleSubmit, watch } = useForm<Inputs>();
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const wallet = useWallet();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function updataBalance() {
      if (publicKey) {
        const newBalance = await connection.getBalance(publicKey);
        setBalance(newBalance / LAMPORTS_PER_SOL);
      }
    }

    updataBalance();

    interval = setInterval(updataBalance, 10000);

    return () => clearInterval(interval);
  }, [publicKey, connection]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.image?.length) {
      const fileList = data.image;
      const imageUri = await uploader(fileList);
      // console.log(imageUri);
      const metaData = createMetaData(imageUri);
      // console.log(metaData);
      const metaDataUri = await uploadMetaData(metaData);
      // console.log(`metaDataUri: ${metaDataUri}`);

      await createAssetAccount(wallet, metaDataUri);
    }
  };

  return (
    <div className="w-1/3">
      {publicKey ? (
        <>
          <h1>Your Public key is: {publicKey?.toString()}</h1>
          <h2>Your Balance is: {balance} SOL</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <PreviewPaper register={register} watch={watch} />
            <Button type="submit">Upload</Button>
          </form>
        </>
      ) : (
        <h1>Wallet is not connected</h1>
      )}
    </div>
  );
};
// const umi = createUmi("https://api.devnet.solana.com").use(irysUploader());
