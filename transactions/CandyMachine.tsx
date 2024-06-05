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
} from "@/utils/umiUtils";
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
      // console.log(imageUri);
      const metaData = createMetaData(imageUri);
      // console.log(metaData);
      const metaDataUri = await getMetaDataUri(umi, metaData);
      // console.log(`metaDataUri: ${metaDataUri}`);

      const collectionSigner = await createCoreCollection(
        umi,
        wallet,
        metaDataUri,
      );

      const candyMachineSigner = await createCandyMachine(
        umi,
        wallet,
        collectionSigner,
      );
      console.log(candyMachineSigner);
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
