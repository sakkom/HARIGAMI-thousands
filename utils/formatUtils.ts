import { useUmiIdentity } from "@/hooks/useUmi";
import {
  Umi,
  createGenericFileFromBrowserFile,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

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

// export const createMetaData = (imageUri: string): any => {
//   const metaData = {
//     name: "wwwwww",
//     description: "description description description",
//     image: imageUri,
//     animation_url: "",
//     external_url: "https://example.com",
//     attributes: [{ trait_type: "天気", value: "晴れ" }],
//   };

//   return metaData;
// };

// export const getImageUri = async (
//   umiIdentity: Umi,
//   fileList: FileList,
// ): Promise<string> => {
//   // umi.use(mockStorage());
//   umiIdentity.use(irysUploader());

//   const file: File = fileList[0];
//   if (!file) throw new Error("No file provided");

//   const genericFile = await createGenericFileFromBrowserFile(file, {
//     contentType: "image/jpg",
//   }); //default: content type none

//   const uriArray = await umiIdentity.uploader.upload([genericFile]);
//   const uri = uriArray[0];

//   return uri;
// };

//MESSAGE: 動的にimageURIをセットするとphantom walletになぜか反映されない。
export const getMetaDataUri = async (
  umiIdentity: Umi,
  fileList: FileList,
): Promise<any> => {
  umiIdentity.use(irysUploader());

  const file: File = fileList[0];
  if (!file) throw new Error("No file provided");

  const genericFile = await createGenericFileFromBrowserFile(file); //content type

  const [imageUri] = await umiIdentity.uploader.upload([genericFile]);

  const uri = await umiIdentity.uploader.uploadJson({
    name: "name",
    description: "Generative art on Solana.",
    image: imageUri,
    animation_url: "",
    external_url: "https://example.com",
    attributes: [
      {
        trait_type: "trait1",
        value: "value1",
      },
    ],
  });

  return uri;
};
