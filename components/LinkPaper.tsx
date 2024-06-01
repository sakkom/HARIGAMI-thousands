"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import { Typography } from "@material-tailwind/react";
import { useVanillaTilt } from "@/hooks/useVanillaTilt";

interface LinkPaperProps {
  content?: string;
  link?: string;
}

export const LinkPaper: React.FC<LinkPaperProps> = ({
  content,
  link = "#",
}) => {
  const paperRef = useVanillaTilt();

  return (
    <div>
      <Link href={link}>
        <Paper
          ref={paperRef}
          className="bg-white bg-opacity-10 aspect-square flex justify-center items-center"
        >
          <Typography variant="h1" className="text-blue-600 underline">
            {content}
          </Typography>
        </Paper>
      </Link>
    </div>
  );
};
