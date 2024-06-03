import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mockStorage } from "@metaplex-foundation/umi-storage-mock";
// import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { PreviewPaper } from "@/components/PreviewPaper";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@material-tailwind/react";
import {
  createGenericFileFromBrowserFile,
  createGenericFileFromJson,
} from "@metaplex-foundation/umi";

type Inputs = {
  image: FileList | null;
};

interface Attributes {
  trait_type?: string;
  value?: string;
}

interface Properties {
  files?: Array<{
    uri?: string;
    type?: string;
    cdn?: boolean;
  }>;
  category: string;
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

const uploadMetaData = async (metaData: MetaData): Promise<string> => {
  const umi = createUmi("https://api.devnet.solana.com").use(mockStorage());
  const jsonMetadata = JSON.stringify(metaData);
  const genericMetaData = createGenericFileFromJson(jsonMetadata);
  const uriArray = await umi.uploader.upload([genericMetaData]);
  const uri = uriArray[0];

  return uri;
};

export const CandyMachine = () => {
  const { register, handleSubmit, watch } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.image?.length) {
      const fileList = data.image;
      const imageUri = await uploader(fileList);
      // console.log(imageUri);
      const metaData = createMetaData(imageUri);
      // console.log(metaData);
      const metaDataUri = await uploadMetaData(metaData);
      // console.log(`metaDataUri: ${metaDataUri}`);
    }
  };

  return (
    <div className="w-1/3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <PreviewPaper register={register} watch={watch} />
        <Button type="submit">Upload</Button>
      </form>
    </div>
  );
};
// const umi = createUmi("https://api.devnet.solana.com").use(irysUploader());
