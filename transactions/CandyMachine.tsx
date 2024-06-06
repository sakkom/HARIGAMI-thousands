//0604 mockStorage -> arwearve
//0604 generic型からuriを作成する同じ関数をリファクタリング
// import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { PreviewPaper } from "@/components/PreviewPaper";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@material-tailwind/react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useUmi } from "@/hooks/useUmi";
import {
  createCoreCollection,
  getImageUri,
  getMetaDataUri,
  createCandyMachine,
  addItems,
  mintFromCandyGuard,
} from "@/utils/candy-machine/createAccount";
import {
  fetchAssetDetail,
  fetchCandyMachineDetail,
  fetchCollectionDetail,
} from "@/utils/candy-machine/fetchAccount";

import { createMetaData } from "@/utils/formatUtils";
import { useBalance } from "@/hooks/useBalance";

type Inputs = {
  image: FileList | null;
};

export const CandyMachine = () => {
  const { register, handleSubmit, watch } = useForm<Inputs>();
  const { connection } = useConnection();
  const wallet = useWallet();
  const publicKey = wallet.publicKey;
  const umi = useUmi();

  const balance = useBalance(publicKey, connection);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.image?.length) {
      const fileList = data.image;

      const imageUri = await getImageUri(umi, fileList);
      console.log(`Step1 Upload Image: ${imageUri}`);

      const metaData = createMetaData(imageUri);
      console.log(`Step2 Setup Metadata`);

      const metaDataUri = await getMetaDataUri(umi, metaData);
      console.log(`Step3 Upload MetaData: ${metaDataUri}`);

      const collectionSigner = await createCoreCollection(
        umi,
        wallet,
        metaDataUri,
      );
      console.log(`Step4 Create Collection\ Id: ${collectionSigner.publicKey}`);

      const candyMachineSigner = await createCandyMachine(
        umi,
        wallet,
        collectionSigner,
      );
      console.log(
        `Step5 Create Candy Machine\ Id: ${candyMachineSigner.publicKey}`,
      );

      await addItems(umi, wallet, candyMachineSigner);
      console.log(`Step6 Create Items`);

      console.log(
        `
        Important Account \
        Core Collection: ${collectionSigner?.publicKey} \
        Candy Machine: ${candyMachineSigner.publicKey}
      `,
      );
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
