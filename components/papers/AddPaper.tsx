"use client";

import React, { useRef, useEffect } from "react";
import Paper from "@mui/material/Paper";
import VanillaTilt from "vanilla-tilt";
import Link from "next/link";
import { Typography } from "@material-tailwind/react";

export default function TiltPaper(props: any) {
  const { children, ...rest } = props;
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = paperRef.current;
    if (element) {
      VanillaTilt.init(element, {
        max: 25,
        speed: 200,
        glare: true,
        "max-glare": 0.5,
      });

      return () => (element as any).vanillaTilt.destroy();
    }
  }, []);

  return (
    <Paper
      ref={paperRef}
      className="bg-white bg-opacity-10 aspect-square"
      {...rest}
    >
      <Link href="/mint-form">
        <Typography variant="h3" className="text-blue-600 underline ">
          {children}
        </Typography>
      </Link>
    </Paper>
  );
}
