import {
  Umi,
  KeypairSigner,
  TransactionBuilderSendAndConfirmOptions,
} from "@metaplex-foundation/umi";
import {
  addConfigLines,
  mplCandyMachine as mplCoreCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { publicKey } from "@metaplex-foundation/umi";

const options: TransactionBuilderSendAndConfirmOptions = {
  send: { skipPreflight: true },
  confirm: { commitment: "processed" },
};

export const addItems = async (
  umiIdentity: Umi,
  candyMachine: KeypairSigner,
): Promise<number | null> => {
  try {
    umiIdentity.use(mplCoreCandyMachine());

    // const id = publicKey("ChF3y7V5m86nZCPho6J7ttVPUiti4ZD3vwUM2jwwUm4f");

    const configLines = [
      { name: "1fdafa", uri: "" },
      { name: "2gvsrfgs", uri: "" },
      { name: "3fasadff", uri: "" },
      { name: "1fdfa", uri: "" },
      { name: "2dfa", uri: "" },
      { name: "3faf", uri: "" },
      { name: "1fdafa", uri: "" },
      { name: "fafd2", uri: "" },
      { name: "afd3", uri: "" },
      { name: "ddfd1", uri: "" },
    ];

    //roop処理したい 印刷処理
    await addConfigLines(umiIdentity, {
      candyMachine: candyMachine.publicKey,
      index: 0,
      configLines,
    }).sendAndConfirm(umiIdentity, options);

    // console.log(`Added items to the Candy Machine: ${candyMachine.publicKey}`);

    return configLines.length;
  } catch (error) {
    console.log("Error adding items to the Candy Machine");
    return null;
  }
};
