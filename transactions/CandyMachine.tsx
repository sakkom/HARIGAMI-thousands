import { useState } from "react";
import { PreviewPaper } from "@/components/PreviewPaper";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Typography } from "@material-tailwind/react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useUmiRpc, useUmiIdentity } from "@/hooks/useUmi";
import {
  createCoreCollection,
  createCandyMachine,
  mintFromCandyGuard,
} from "@/utils/candy-machine/createAccount";
import { getMetaDataUri } from "@/utils/formatUtils";
import { addItems } from "@/utils/candy-machine/updateAccount";
import { useBalance } from "@/hooks/useBalance";

type Inputs = {
  image: FileList | null;
};

export const CandyMachine = () => {
  const { register, handleSubmit, watch } = useForm<Inputs>();
  const { connection } = useConnection();
  const wallet = useWallet();
  const publicKey = wallet.publicKey;
  const umiRpc = useUmiRpc();
  const umiIdentity = useUmiIdentity(wallet);
  const balance = useBalance(publicKey, connection);

  // const [assetStatus, setAssetStatus] = useState<any>(null);
  // const [collectionStatus, setCollectionStatus] = useState<any>(null);
  // const [candyMachineStatus, setCandyMachineStatus] = useState<any>(null);
  // const [image, setImage] = useState<any>(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.image?.length) {
      const fileList = data.image;

      const metaDataUri = await getMetaDataUri(umiIdentity, fileList);
      console.log(`Step1 Upload MetaData: ${metaDataUri}`);

      const collectionSigner = await createCoreCollection(
        umiIdentity,
        metaDataUri,
      );
      console.log(`Step2 Create Collection\ Id: ${collectionSigner.publicKey}`);

      const candyMachineSigner = await createCandyMachine(
        umiIdentity,
        collectionSigner,
        metaDataUri,
      );
      console.log(
        `Step3 Create Candy Machine\ Id: ${candyMachineSigner.publicKey}`,
      );

      const quantity = await addItems(umiIdentity, candyMachineSigner);
      console.log(`Step4 Supply Items ${quantity}`);

      console.log(
        `
          Important Account \
          Core Collection: ${collectionSigner?.publicKey} \
          Candy Machine: ${candyMachineSigner.publicKey}
        `,
      );
    }
  };

  const checkMint = async () => {
    await mintFromCandyGuard(umiIdentity);
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
          <Button onClick={() => checkMint()}>Mint</Button>
        </>
      ) : (
        <h1>Wallet is not connected</h1>
      )}
    </div>
  );
};
// const umi = createUmi("https://api.devnet.solana.com").use(irysUploader());
