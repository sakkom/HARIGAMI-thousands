import * as web3 from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import Squads from "@sqds/sdk";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

export const initializeSquadsSDK = () => {
  const keypair = getKeypairFromEnvironment("SECRET_KEY");

  const wallet = new NodeWallet(keypair);

  const squads = Squads.devnet(wallet);

  return squads;
};

export const allocateMultisigPda = async (msPda: web3.PublicKey) => {
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed",
  );

  const keypair = getKeypairFromEnvironment("SECRET_KEY");

  const transferTransaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: msPda,
      lamports: 0.03 * web3.LAMPORTS_PER_SOL,
    }),
  );

  await web3.sendAndConfirmTransaction(connection, transferTransaction, [
    keypair,
  ]);
};
