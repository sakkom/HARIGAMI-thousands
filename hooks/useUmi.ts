import { Umi } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { WalletContextState } from "@solana/wallet-adapter-react";

export const useUmiRpc = () => {
  const endpoint = "https://api.devnet.solana.com";
  // const endpoint = "https://devnet-rpc.shyft.to?api_key=aEoNRy0ZFiWQX_Lv";

  const umi = createUmi(endpoint);

  return umi;
};

export const useUmiIdentity = (wallet: WalletContextState): Umi => {
  const endpoint = "https://api.devnet.solana.com";

  const umi = createUmi(endpoint).use(walletAdapterIdentity(wallet));

  return umi;
};
