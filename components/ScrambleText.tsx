import { FC } from "react";
import { useScramble } from "use-scramble";
import { Typography } from "@mui/material";

interface ScrambleTextProps {
  textInput: string;
  variant: "h1" | "h2" | "h6";
  isMount?: boolean;
  scramble: number;
  className?: string | undefined;
}

export const ScrambleText: FC<ScrambleTextProps> = ({
  textInput,
  variant,
  isMount,
  scramble,
  className,
}) => {
  const { ref } = useScramble({
    text: textInput,
    range: [65, 125],
    speed: 1,
    tick: 10,
    step: 5,
    scramble: scramble,
    playOnMount: isMount,
  });
  return (
    <Typography variant={variant} ref={ref} className={className}></Typography>
  );
};
