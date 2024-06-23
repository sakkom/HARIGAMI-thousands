import {
  Umi,
  KeypairSigner,
  TransactionBuilderSendAndConfirmOptions,
  TransactionBuilderGroup,
  TransactionBuilder,
} from "@metaplex-foundation/umi";
import {
  addConfigLines,
  mplCandyMachine as mplCoreCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
// import { base58 } from "@metaplex-foundation/umi/serializers";

const options: TransactionBuilderSendAndConfirmOptions = {
  send: { skipPreflight: true },
  confirm: { commitment: "processed" },
};

export const addItems = async (
  umiIdentity: Umi,
  candyMachine: KeypairSigner,
  // quantity: number,
): Promise<number | null> => {
  try {
    umiIdentity.use(mplCoreCandyMachine());

    await addConfigLines(umiIdentity, {
      candyMachine: candyMachine.publicKey,
      index: 0,
      configLines: [
        { name: "", uri: "" },
        { name: "", uri: "" },
        { name: "validater", uri: "" },
        { name: "", uri: "" },
        { name: "", uri: "" },
        { name: "", uri: "" },
        { name: "", uri: "" },
        { name: "", uri: "" },
        { name: "", uri: "" },
        { name: "", uri: "" },
      ],
    }).sendAndConfirm(umiIdentity, options);

    return 10;
  } catch (error) {
    console.log("Error adding items to the Candy Machine");
    return null;
  }
};
