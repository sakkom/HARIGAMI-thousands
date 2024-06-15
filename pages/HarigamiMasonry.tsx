"use client";
import { FC } from "react";
import Masonry from "@mui/lab/Masonry";
import Link from "next/link";
import {
  useUrisWithCandyMachine,
  useImagesWithCandyMachine,
} from "@/hooks/useCandy";
import { TiltPaper } from "@/components/TiltPaper";
import { ViewProps } from "@/types/cutomInterface";

export const HarigamiMasonry: FC<ViewProps> = ({ umi, collectionIds }) => {
  const uris = useUrisWithCandyMachine(umi, collectionIds);

  const imageWithCandyMachine = useImagesWithCandyMachine(uris);

  return (
    <>
      <Masonry columns={5} spacing={1}>
        {imageWithCandyMachine?.map((item, index) => (
          <Link key={index} href={`/view/${item.candyMachineId}`}>
            <>
              <TiltPaper key={index} imgUrl={item.coverImage} index={index} />
            </>
          </Link>
        ))}
      </Masonry>
    </>
  );
};
