"use client";

import { FC } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import Link from "next/link";

function HideOnScroll(props: any) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export const AppBar: FC = () => {
  return (
    <HideOnScroll>
      <div className="app-bar">
        <div className="flex items-end">
          <Link href={"/collection"}>
            <HomeIcon fontSize="large" />
          </Link>
          <Link href={"/assets"}>
            <PersonIcon fontSize="large" />
          </Link>
        </div>
        <WalletMultiButton style={{}} />
      </div>
    </HideOnScroll>
  );
};
