import * as web3 from "@solana/web3.js";
import { useTxAccounts } from "@/hooks/useDao";
import { useTxPdas } from "@/hooks/useStored";
import { approveTxUser } from "@/utils/squads";
import { Paper, Typography, Divider, Button } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { MultisigAccount, TransactionAccount } from "@sqds/sdk";
import { FC, useState, useEffect } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import BackHandIcon from "@mui/icons-material/BackHand";
import FlagIcon from "@mui/icons-material/Flag";

interface ValidaterProps {
  msState: MultisigAccount;
}

export const Validater: FC<ValidaterProps> = ({ msState }) => {
  const wallet = useWallet();
  const user = wallet?.publicKey;

  const txPdas: string[] = useTxPdas(msState.publicKey.toString());
  const initialTxStates: TransactionAccount[] = useTxAccounts(txPdas);
  const [txStates, setTxStates] = useState<TransactionAccount[]>([]);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  // console.log(txAccounts);
  const [isMember, setIsMember] = useState<boolean>(false);

  useEffect(() => {
    if (initialTxStates.length > 0) {
      setTxStates(initialTxStates);
    }
  }, [initialTxStates]);

  useEffect(() => {
    if (txStates.length > 0) {
      console.log("foo", txStates);
    }
  }, [txStates]);

  useEffect(() => {
    if (user && msState?.keys) {
      const isMemberCheck = msState.keys.some(
        (member) => member.toString() === user.toBase58(),
      );
      setIsMember(isMemberCheck);
    }
  }, [user, msState]);

  useEffect(() => {
    const executeTx = async () => {
      const responses = await Promise.all(
        txStates
          .filter((tx) => tx.status.executeReady)
          .map(async (tx) => {
            const res = await fetch(
              `http://localhost:3000/api/post/executeTx/${tx.publicKey}`,
              {
                method: "POST",
              },
            );
            const data = await res.json();
            return data.txState as TransactionAccount;
          }),
      );

      setTxStates(responses);
      window.location.reload();
    };

    if (txStates.some((tx) => tx.status?.executeReady)) {
      executeTx();
    }
  }, [txStates]);

  const handleApproveTx = async (transactionPda: web3.PublicKey) => {
    if (wallet && transactionPda) {
      const txState = await approveTxUser(wallet, transactionPda);
      const isApproved = txState.approved.some(
        (i) => new web3.PublicKey(i) === user,
      );

      setIsApproved(isApproved);
      setTxStates((prevStates) => [...prevStates, txState]);
    }
  };

  return (
    <div className="w-full">
      {/* transactionある場合のみ表示 */}

      <Paper className="blackGlassPaper">
        <Typography variant="h5">pending</Typography>
        {txStates?.map(
          (txState?) =>
            txState?.status?.active && (
              <Paper className="blackGlassPaper m-5">
                <div className="flex justify-between px-3">
                  <div className="flex m-3 gap-3 items-center">
                    <GroupsIcon fontSize="medium" />
                    <Typography variant="h6">New Member!</Typography>
                  </div>
                  <div className=" flex gap-3 justify-center">
                    <div className="flex gap-3 items-center ">
                      <BackHandIcon fontSize="medium" />
                      <Typography variant="h6">
                        {txState?.approved?.length} / {msState?.keys?.length}
                      </Typography>
                    </div>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <div className="flex gap-3 items-center">
                      <FlagIcon fontSize="medium" />
                      <Typography variant="h6">
                        {msState.threshold} / {msState?.keys?.length}
                      </Typography>
                    </div>
                  </div>
                </div>

                {isMember &&
                  (isApproved ? (
                    <Button
                      onClick={() => handleApproveTx(txState?.publicKey)}
                      className="w-full"
                      variant="outlined"
                      sx={{ color: "white", backgroundColor: "black" }}
                    >
                      Thanks
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleApproveTx(txState?.publicKey)}
                      className="w-full"
                      variant="outlined"
                      sx={{ color: "white", backgroundColor: "black" }}
                    >
                      Approve
                    </Button>
                  ))}
              </Paper>
            ),
        )}
      </Paper>
    </div>
  );
};
