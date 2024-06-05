import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

export const useUmi = () => {
  // const endpoint = "https://api.devnet.solana.com";
  const endpoint = "https://devnet-rpc.shyft.to?api_key=aEoNRy0ZFiWQX_Lv";

  const umi = createUmi(endpoint);

  return umi;
};
