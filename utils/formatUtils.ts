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

//MESSAGE: 動的にimageURIをセットするとphantom walletになぜか反映されない。
export const getMetadataUri = async (
  umiIdentity: Umi,
  coverImage: File,
  title: string,
  genre?: string,
): Promise<any> => {
  umiIdentity.use(irysUploader());

  const genericFile = await createGenericFileFromBrowserFile(coverImage); //content type

  const [imageUri] = await umiIdentity.uploader.upload([genericFile]);

  const uri = await umiIdentity.uploader.uploadJson({
    name: title,
    description: "Generative art on Solana.",
    image: imageUri,
    animation_url: "",
    external_url: "https://example.com",
    attributes: [
      {
        trait_type: "Genre",
        value: genre,
      },
    ],
  });

  return uri;
};
