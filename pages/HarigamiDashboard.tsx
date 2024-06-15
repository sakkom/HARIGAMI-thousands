import { PublicKey } from "@metaplex-foundation/umi";
import { FC } from "react";
import { Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { MintPaper } from "@/components/MintForm";
import { Button } from "@material-tailwind/react";
import SavingsIcon from "@mui/icons-material/Savings";
// import { Rock_Salt } from "next/font/google";
import { Rock_Salt } from "next/font/google";

// interface HarigamiDashboardProps {
//   candyMachineId: PublicKey;
//   collectionMint: PublicKey;
// }
const rockSalt = Rock_Salt({ subsets: ["latin"], weight: ["400"] });

export const HarigamiDashboard /*: FC<HarigamiDashboardProps>*/ = () => {
  return (
    <div>
      <Grid container spacing={0}>
        <Grid xs={6}>
          <MintPaper />
        </Grid>
        <Grid xs={6}>
          <Paper className="aspect-video blackGlassPaper flex justify-center items-center">
            <SavingsIcon fontSize={"large"} />
            <div className="flex items-end">
              <Typography variant="h3">5.55</Typography>
              <Typography variant="body1">SOL</Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
