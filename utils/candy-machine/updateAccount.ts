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
  quantity: number,
): Promise<number | null> => {
  try {
    umiIdentity.use(mplCoreCandyMachine());

    const configLines = Array.from({ length: quantity }, (_, i) => ({
      name: `${i}`,
      uri: "",
    }));

    const batchSize = 10;
    let totalAdded = 0;

    const builders: TransactionBuilder[] = [];

    for (let i = 0; i < configLines.length; i += batchSize) {
      const batch = configLines.slice(i, i + batchSize);

      const transactionBuilder = addConfigLines(umiIdentity, {
        candyMachine: candyMachine.publicKey,
        index: i,
        configLines: batch,
      });

      builders.push(transactionBuilder);

      totalAdded += batch.length;
    }

    const transactionBuilderGroup = new TransactionBuilderGroup(builders);

    const results = await transactionBuilderGroup.sendAndConfirm(
      umiIdentity,
      options,
    );

    // const sigs = results.map((result) => result.signature);
    // console.log(
    //   sigs.map((sig) => {
    //     return base58.deserialize(sig)[0];
    //   }),
    // );

    return totalAdded;
  } catch (error) {
    console.log("Error adding items to the Candy Machine");
    return null;
  }
};
