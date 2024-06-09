import { publicKey, Umi } from "@metaplex-foundation/umi";
import {
  fetchCollectionV1,
  CollectionV1,
  fetchAssetV1,
  AssetV1,
} from "@metaplex-foundation/mpl-core";
import {
  mplCandyMachine as mplCoreCandyMachine,
  fetchCandyMachine,
  CandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";

export const fetchCollectionDetail = async (
  umiRpc: Umi,
  address: string,
): Promise<CollectionV1> => {
  const id = publicKey(address);

  const result = await fetchCollectionV1(umiRpc, id);
  // console.log(asset);
  return result;
};

export const fetchAssetDetail = async (
  umiRpc: Umi,
  address: string,
): Promise<AssetV1> => {
  const id = publicKey(address);

  const result = await fetchAssetV1(umiRpc, id);
  console.log({ result });

  return result;
};

export const fetchCandyMachineDetail = async (
  umiRpc: Umi,
  address: string,
): Promise<CandyMachine> => {
  umiRpc.use(mplCoreCandyMachine());

  const id = publicKey(address);

  const result = await fetchCandyMachine(umiRpc, id, {
    commitment: "confirmed",
  });
  // console.log({ });
  return result;
};
