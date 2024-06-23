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
import { storeVersionIds, storeHarigamiCollection } from "@/utils/storeUtils";
// import { createHarigamiSquad } from "@/utils/squads";
import { PublicKey } from "@solana/web3.js";
import { postMultisig } from "@/utils/apiUtils";

export const createHarigamiVersion = async (
  umiIdentity: Umi,
  data: HarigamiInputs,
  creator: web3.PublicKey,
  updateProgress: (progress: number) => void,
): Promise<void> => {
  const coverImage: File = data.coverImage[0];
  const title = data.title;
  // const genre = data.genre;
  const quantity = data.quantity;

  const metaDataUri = await getMetadataUri(
    umiIdentity,
    coverImage,
    title,
    // genre,
  );

  updateProgress(20);

  const collectionSigner = await createCoreCollection(
    umiIdentity,
    metaDataUri,
    title,
  );

  updateProgress(40);

  const nodeManager = new web3.PublicKey(
    "HC7xyZvuwMyA6CduUMbAWXmvp4vTmNLUGoPi5xVc3t7P",
  );
  const initialMembers = [nodeManager, creator];

  const { msPda, vaultPda } = await postMultisig(initialMembers);

  updateProgress(60);

  const candyMachineSigner = await createCandyMachine(
    umiIdentity,
    collectionSigner,
    metaDataUri,
    // quantity,
    vaultPda,
    title,
  );

  updateProgress(80);

  const message = await addItems(umiIdentity, candyMachineSigner); //test 10

  updateProgress(100);

  console.log(
    `
      Important Account \n
      Core Collection: ${collectionSigner?.publicKey} \n
      Candy Machine: ${candyMachineSigner?.publicKey} \n
      Setup Items: ${message}
    `,
  );

  await storeVersionIds(
    creator,
    candyMachineSigner.publicKey,
    collectionSigner.publicKey,
    msPda,
  );
  await storeHarigamiCollection(creator, collectionSigner.publicKey);
};
