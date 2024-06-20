"use client";

import { postMultisig } from "@/utils/apiUtils";
import * as web3 from "@solana/web3.js";
import { Button } from "@mui/material";

export default function Page() {
  const handlePost = async () => {
    console.log("foo");
    const nodeManager = new web3.PublicKey(
      "HC7xyZvuwMyA6CduUMbAWXmvp4vTmNLUGoPi5xVc3t7P",
    );
    const creator = new web3.PublicKey(
      "9eaVFdsmdZcUArXfwR5AT6VSrRwE77TzGGpLe6XxMXR2",
    );
    const initialMembers = [nodeManager, creator];

    console.log("hello");
    const res = await postMultisig(1, initialMembers);
    console.log(res);
  };

  return <Button onClick={handlePost}>PostMultisig</Button>;
}
