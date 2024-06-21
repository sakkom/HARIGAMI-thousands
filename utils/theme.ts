"use client";
import { createTheme } from "@mui/material";
import { Poppins } from "next/font/google";

const font = Poppins({
  weight: ["700"],
  subsets: ["latin"],
});

export const theme = createTheme({
  typography: {
    fontFamily: font.style.fontFamily,
  },
});
