// import { mockStorage } from "@metaplex-foundation/umi-storage-mock";
import * as web3 from "@solana/web3.js";
import {
  generateSigner,
  KeypairSigner,
  Umi,
  some,
  sol,
  TransactionBuilderSendAndConfirmOptions,
  publicKey,
  transactionBuilder,
  PublicKey,
} from "@metaplex-foundation/umi";
import { mplCore, createCollectionV1 } from "@metaplex-foundation/mpl-core";
import {
  create,
  mplCandyMachine as mplCoreCandyMachine,
  mintV1,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import { base58 } from "@metaplex-foundation/umi/serializers";

//change for a production environment.
const options: TransactionBuilderSendAndConfirmOptions = {
  send: { skipPreflight: true },
  confirm: { commitment: "processed" },
};

export const createCoreCollection = async (
  umiIdentity: Umi,
  uri: string,
  title: string,
): Promise<KeypairSigner> => {
  umiIdentity.use(mplCore());

  const collectionSigner = generateSigner(umiIdentity);

  // const name = metaData.name;
  const { signature } = await createCollectionV1(umiIdentity, {
    collection: collectionSigner,
    name: title, //nameをuri.nameと同一にする　これがCandy Machineの名前となるから。
    uri: uri,
  }).sendAndConfirm(umiIdentity);

  console.log(`Create Collection! tx: ${base58.deserialize(signature)[0]}`);

  return collectionSigner;
};

export const createCandyMachine = async (
  umiIdentity: Umi,
  collectionSigner: KeypairSigner,
  uri: string,
  // quantity: number,
  vault: any,
  name: string,
): Promise<KeypairSigner> => {
  umiIdentity.use(mplCoreCandyMachine());
  // if (!collectionSigner) throw Error("collection is null");

  const candyMachineSigner = generateSigner(umiIdentity);

  //リファクタリング
  const createIx = await create(umiIdentity, {
    candyMachine: candyMachineSigner,
    collection: collectionSigner.publicKey,
    collectionUpdateAuthority: umiIdentity.identity,
    itemsAvailable: 10,
    authority: umiIdentity.identity.publicKey,
    isMutable: true,
    configLineSettings: some({
      prefixName: "貼紙 #",
      nameLength: 20,
      prefixUri: uri,
      uriLength: 30,
      isSequential: false,
    }),
    guards: {
      botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      solPayment: some({
        lamports: sol(0.067),
        destination: vault,
      }),
    },
  });

  const { signature } = await createIx.sendAndConfirm(umiIdentity, options);

  const tx = base58.deserialize(signature)[0];
  console.log(
    `Create Candy Machine! tx:  ${tx}\ Candy machine id: ${candyMachineSigner.publicKey}`,
  );

  return candyMachineSigner;
};

export const mintFromCandyGuard = async (
  umiIdentity: Umi,
  candyMachineId: PublicKey,
  collectionId: PublicKey,
  vault: web3.PublicKey,
): Promise<any> => {
  umiIdentity.use(mplCoreCandyMachine());

  const assetSigner = generateSigner(umiIdentity);

  const { signature } = await transactionBuilder()
    .add(setComputeUnitLimit(umiIdentity, { units: 800_000 }))
    .add(
      mintV1(umiIdentity, {
        candyMachine: candyMachineId,
        asset: assetSigner,
        collection: collectionId,
        mintArgs: {
          solPayment: some({ destination: publicKey(vault) }),
        },
      }),
    )
    .sendAndConfirm(umiIdentity, options);

  console.log(
    `OK! signature: ${base58.deserialize(signature)[0]}\ Asset Id: ${assetSigner.publicKey}`,
  );

  return assetSigner;
};
