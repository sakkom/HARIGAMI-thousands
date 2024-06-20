"use client";
import { useContext } from "react";
import { UmiContext } from "@/context/UmiProvider";
import { useCandyIds } from "@/hooks/useStored";
import { CollectionIdWithCandyMachineId } from "@/types/customTypes";
import { useCollectionIds } from "@/hooks/useCandy";
import { HarigamiMasonry } from "@/pages/HarigamiMasonry";

export default function Page() {
  const umi = useContext(UmiContext);
  const candyIds: string[] = useCandyIds();
  const collectionIds: CollectionIdWithCandyMachineId[] = useCollectionIds(
    umi,
    candyIds,
  );

  return <HarigamiMasonry umi={umi} collectionIds={collectionIds} />;
}
