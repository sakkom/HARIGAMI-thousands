import { useVaultBalance } from "@/hooks/useDao";
import { Paper, Typography } from "@mui/material";
import { MultisigAccount } from "@sqds/sdk";
import { FC } from "react";
import FlagIcon from "@mui/icons-material/Flag";

interface DaoOverviewProps {
  msState: MultisigAccount;
}

export const DaoOverview: FC<DaoOverviewProps> = ({ msState }) => {
  const { balanceUsd } = useVaultBalance(msState.publicKey);

  return (
    <div className="w-full">
      <Paper className="blackGlassPaper flex flex-col items-start">
        <Typography variant="h3">harigami dao</Typography>
      </Paper>

      <Paper className="blackGlassPaper  flex flex-col items-start">
        <div className="felx">
          <Typography variant="h5">net worth</Typography>
          {balanceUsd ? (
            <Typography variant="h4">{`$ ${balanceUsd}`}</Typography>
          ) : (
            <Typography variant="h4">$ 0</Typography>
          )}
        </div>
      </Paper>

      <Paper className="blackGlassPaper">
        <div className="flex gap-3 justify-start">
          <Typography variant="h4">validater</Typography>
          <div className="flex gap-1 items-center">
            <FlagIcon fontSize="medium" />
            <Typography variant="h6">
              {msState.threshold} / {msState?.keys.length}
            </Typography>
          </div>
        </div>

        {msState?.keys.map((item, index) => (
          <Typography variant="body1" key={index}>
            {item.toString()}
          </Typography>
        ))}
      </Paper>
    </div>
  );
};
