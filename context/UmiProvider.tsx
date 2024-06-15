"use client";

import React, { FC, createContext, useMemo } from "react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

interface UmiProps {
  children: React.ReactNode;
}

export const UmiContext = createContext<any>(null);

export const UmiProvider: FC<UmiProps> = ({ children }) => {
  const endpoint = "https://api.devnet.solana.com";
  // const endpoint = "https://devnet-rpc.shyft.to?api_key=aEoNRy0ZFiWQX_Lv";
  const umi = useMemo(() => createUmi(endpoint), []);

  return <UmiContext.Provider value={umi}>{children}</UmiContext.Provider>;
};
