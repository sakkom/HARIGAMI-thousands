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
  umi: Umi,
  address: string,
): Promise<CollectionV1> => {
  const id = publicKey(address);

  const result = await fetchCollectionV1(umi, id);
  // console.log(asset);
  return result;
};

export const fetchAssetDetail = async (
  umi: Umi,
  address: string,
): Promise<AssetV1> => {
  const id = publicKey(address);

  const result = await fetchAssetV1(umi, id);
  console.log({ result });

  return result;
};

export const fetchCandyMachineDetail = async (
  umi: Umi,
  address: string,
): Promise<CandyMachine> => {
  umi.use(mplCoreCandyMachine());

  const id = publicKey(address);

  const result = await fetchCandyMachine(umi, id, {
    commitment: "confirmed",
  });
  // console.log({ });
  return result;
};
