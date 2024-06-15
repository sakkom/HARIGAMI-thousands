import {
  CollectionIdWithCandyMachineId,
  CollectionV1WithCandyMachineId,
  ImageWithCandyMachineId,
} from "@/types/customTypes";

export const filterCollectionIdWithCandyMachineId = (
  results: (CollectionIdWithCandyMachineId | undefined)[],
) => {
  return results.filter(
    (item): item is CollectionIdWithCandyMachineId => item != undefined,
  );
};

export const filterCollectionV1WithCandyMachineId = (
  results: (CollectionV1WithCandyMachineId | undefined)[],
) => {
  return results.filter(
    (item): item is CollectionV1WithCandyMachineId => item !== undefined,
  );
};

export const filterImageWithCandyMachineId = (
  results: (ImageWithCandyMachineId | undefined)[],
) => {
  return results.filter(
    (image): image is ImageWithCandyMachineId => image !== undefined,
  );
};
