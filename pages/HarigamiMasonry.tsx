"use client";
import Masonry from "@mui/lab/Masonry";

import { CollectionV1 } from "@metaplex-foundation/mpl-core";
import { CandyMachine } from "@metaplex-foundation/mpl-core-candy-machine";
import { useCandyIds } from "@/hooks/useFireStore";
import {
  useCandyMachines,
  useCollections,
  useCollectionImages,
} from "@/hooks/useCandy";
import { TiltPaper } from "@/components/TiltPaper";
import { LinkPaper } from "@/components/LinkPaper";

export const HarigamiMasonry = () => {
  const candyIds: string[] = useCandyIds();

  const candyMachines: CandyMachine[] = useCandyMachines(candyIds);

  const collections: CollectionV1[] = useCollections(candyMachines);

  const collectionImages: string[] = useCollectionImages(collections);

  return (
    <>
      <Masonry columns={5} spacing={1}>
        <LinkPaper content="Mint!" link="/mint" />

        {collectionImages?.map((img, index) => (
          <>
            <TiltPaper key={index} imgUrl={img} index={index} />
          </>
        ))}
      </Masonry>
    </>
  );
};
