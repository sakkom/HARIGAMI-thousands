import { FC } from "react";
import { HarigamiAvailable } from "@/components/HarigamiAvailable";
import { ScrambleText } from "@/components/ScrambleText";
import { HarigamiDetail } from "@/types/customTypes";
import { Paper, Typography } from "@mui/material";
import { Rock_Salt } from "next/font/google";
import Link from "next/link";

const rockSalt = Rock_Salt({ subsets: ["latin"], weight: ["400"] });

interface HarigamiInfoProps {
  detail: HarigamiDetail;
}

export const HarigamiInfo: FC<HarigamiInfoProps> = ({ detail }) => {
  // console.log(harigamiDetail); //4回useEffect

  const itemsAvailable_num = detail?.itemsAvailable_num ?? 0;
  const itemsLoaded = detail?.itemsLoaded ?? 0;
  const itemsRedeemed_num = detail?.itemsRedeemed_num ?? 0;

  // const candyMachine = await
  //
  const imageUrl = detail?.coverImage;

  const title = detail?.title ?? "";

  const collectionMint = detail?.collectionMint;
  return (
    <>
      <Link href={`/${collectionMint}`}>
        <Typography variant="h6" color={"pink"}>
          https://core
        </Typography>
      </Link>
      <Link href={`#`}>
        <Typography variant="h6" color={"pink"}>
          https://solana
        </Typography>
      </Link>
      <HarigamiAvailable
        itemsAvailable_num={itemsAvailable_num}
        itemsLoaded={itemsLoaded}
        itemsRedeemed_num={itemsRedeemed_num}
      />
      <div className=" w-full aspect-square overflow-hidden flex justify-center ">
        <img src={imageUrl} className="object-contain " />
      </div>
      {/* On-chain Tilte & Description */}
      <Paper className="blackGlassPaper">
        <ScrambleText
          textInput={title}
          variant="h2"
          className={rockSalt.className}
          scramble={5}
        />

        <Typography variant="body1">
          Bacon ipsum dolor amet consequat nostrud capicola t-bone pork chop,
          sed corned beef flank sausage excepteur. Fatback pork aliqua filet
          mignon, frankfurter ad culpa. T-bone tongue shankle dolor. Ullamco eu
          fatback, filet mignon bacon excepteur id quis dolor jerky beef
          frankfurter minim burgdoggen. Swine chicken leberkas ad ullamco tail
          cow meatball biltong commodo quis deserunt qui officia aute. Leberkas
          nulla ut magna beef consequat est jerky rump esse flank. Spare ribs
          ipsum adipisicing chislic corned beef fatback strip steak, do esse
          picanha leberkas bacon magna kielbasa.
          <br />
          <br />
          Sunt chislic elit sint, short loin ut consequat ribeye ut veniam
          aliqua corned beef sed in. Commodo ut duis sunt labore proident do
          adipisicing kevin esse rump ad ea. Fugiat lorem pastrami, chuck ham
          excepteur bacon cillum dolore. Qui chicken excepteur tongue, cillum
          picanha tempor nulla. Jowl tail short ribs cillum cow sausage, tri-tip
          chuck flank culpa laborum salami.
        </Typography>
      </Paper>
    </>
  );
};
