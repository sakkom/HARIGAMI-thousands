import { useVanillaTilt } from "@/hooks/useVanillaTilt";
import { Paper } from "@mui/material";
import { FC } from "react";
import Image from "next/image";

interface TiltPaperProps {
  imgUrl: string | undefined;
  index?: number;
}

export const TiltPaper: FC<TiltPaperProps> = ({ imgUrl, index }) => {
  const tiltRef = useVanillaTilt();

  return (
    <Paper
      ref={tiltRef}
      className="blackGlassPaper flex justify-center p-5 aspect-square"
    >
      {imgUrl && (
        <img
          key={index}
          src={imgUrl}
          alt={`Collection Image ${index}`}
          className="object-cover"
        />
      )}
    </Paper>
  );
};
