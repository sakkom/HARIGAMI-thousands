import "dotenv/config";
import * as web3 from "@solana/web3.js";
import { Umi } from "@metaplex-foundation/umi";
import { HarigamiInputs } from "@/pages/HarigamiForm";
import {
  createCoreCollection,
  createCandyMachine,
} from "@/utils/candy-machine/createAccount";
import { getMetadataUri } from "@/utils/commoUtils";
import { addItems } from "@/utils/candy-machine/updateAccount";
import { storeVersionIds } from "@/utils/storeUtils";
// import { createHarigamiSquad } from "@/utils/squads";
import { PublicKey } from "@solana/web3.js";
import { postMultisig } from "@/utils/apiUtils";

export const createHarigamiVersion = async (
  umiIdentity: Umi,
  data: HarigamiInputs,
  creator: web3.PublicKey,
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

  const nodeManager = new web3.PublicKey(
    "HC7xyZvuwMyA6CduUMbAWXmvp4vTmNLUGoPi5xVc3t7P",
  );
  const initialMembers = [nodeManager, creator];

  const { msPda, vaultPda } = await postMultisig(1, initialMembers);

  const candyMachineSigner = await createCandyMachine(
    umiIdentity,
    collectionSigner,
    metaDataUri,
    quantity,
    vaultPda,
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

  await storeVersionIds(
    candyMachineSigner.publicKey,
    collectionSigner.publicKey,
    msPda,
  );

  return `Ok! set up harigami version`;
};
