"use client";

import { FC } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";

export const AppBar: FC = () => {
  return (
    <div className="app-bar">
      <div className="flex items-end">
        <HomeIcon fontSize="large" />
        <PersonIcon fontSize="large" />
      </div>
      <WalletMultiButton style={{}} />
    </div>
  );
};
