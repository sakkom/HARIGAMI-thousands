import { Umi } from "@metaplex-foundation/umi";
import { HarigamiInputs } from "@/components/HarigamiForm";
import {
  createCoreCollection,
  createCandyMachine,
} from "@/utils/candy-machine/createAccount";
import { getMetadataUri } from "@/utils/formatUtils";
import { addItems } from "@/utils/candy-machine/updateAccount";
import { storeVersionId } from "@/utils/firestoreUtils";
import { createHarigamiSquad } from "@/utils/squads";
import { PublicKey } from "@solana/web3.js";

export const createHarigamiVersion = async (
  umiIdentity: Umi,
  data: HarigamiInputs,
  wallet: any,
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

  const collectionSigner = await createCoreCollection(
    umiIdentity,
    metaDataUri,
    title,
  );

  const createKey = new PublicKey(collectionSigner.publicKey);

  const { multisigId, vault } = await createHarigamiSquad(
    wallet,
    createKey,
    [wallet.publicKey],
    title,
  );
  console.log("ok multisig");

  const candyMachineSigner = await createCandyMachine(
    umiIdentity,
    collectionSigner,
    metaDataUri,
    quantity,
    vault,
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

  await storeVersionId(candyMachineSigner.publicKey, multisigId);

  return `Ok! set up harigami version`;
};
