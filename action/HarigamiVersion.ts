import { Umi } from "@metaplex-foundation/umi";
import { HarigamiInputs } from "@/pages/HarigamiForm";
import {
  createCoreCollection,
  createCandyMachine,
} from "@/utils/candy-machine/createAccount";
import { getMetadataUri } from "@/utils/formatUtils";
import { addItems } from "@/utils/candy-machine/updateAccount";
import { storeCandyMachineId } from "@/utils/firestoreUtils";

export const createHarigamiVersion = async (
  umiIdentity: Umi,
  data: HarigamiInputs,
): Promise<string> => {
  const coverImage: File = data.coverImage[0];
  const title = data.title;
  const genre = data.genre;
  const quantity = data.quantity;

  const metaDataUri = await getMetadataUri(
    umiIdentity,
    coverImage,
    title,
    genre,
  );

  const collectionSigner = await createCoreCollection(umiIdentity, metaDataUri);

  const candyMachineSigner = await createCandyMachine(
    umiIdentity,
    collectionSigner,
    metaDataUri,
    quantity,
  );

  const message = await addItems(umiIdentity, candyMachineSigner, quantity);

  console.log(
    `
      Important Account \n
      Core Collection: ${collectionSigner?.publicKey} \n
      Candy Machine: ${candyMachineSigner?.publicKey} \n
      Setup Items: ${message}
    `,
  );

  await storeCandyMachineId(candyMachineSigner.publicKey);

  return `Ok! set up harigami version`;
};
