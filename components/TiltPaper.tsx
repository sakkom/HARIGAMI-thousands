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
    <Paper ref={tiltRef}>
      {imgUrl && (
        <Image
          key={index}
          src={imgUrl}
          alt={`Collection Image ${index}`}
          width={500}
          height={500}
          priority={index === 0}
        />
      )}
    </Paper>
  );
};
