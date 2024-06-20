import {
  CollectionIdWithCandyMachineId,
  CollectionV1WithCandyMachineId,
  ImageWithCandyMachineId,
} from "@/types/customTypes";

import {
  Umi,
  createGenericFileFromBrowserFile,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

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

export const filterCollectionIdWithCandyMachineId = (
  results: (CollectionIdWithCandyMachineId | undefined)[],
) => {
  return results.filter(
    (item): item is CollectionIdWithCandyMachineId => item != undefined,
  );
};

export const filterCollectionV1WithCandyMachineId = (
  results: (CollectionV1WithCandyMachineId | undefined)[],
) => {
  return results.filter(
    (item): item is CollectionV1WithCandyMachineId => item !== undefined,
  );
};

export const filterImageWithCandyMachineId = (
  results: (ImageWithCandyMachineId | undefined)[],
) => {
  return results.filter(
    (image): image is ImageWithCandyMachineId => image !== undefined,
  );
};
