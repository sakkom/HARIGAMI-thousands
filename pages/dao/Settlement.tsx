import * as web3 from "@solana/web3.js";
import { useVaultBalance } from "@/hooks/useDao";
import { useSettlement } from "@/hooks/useStored";
import { postActiveSettle } from "@/utils/apiUtils";
import { approveTxUser } from "@/utils/squads";
import { Paper, Typography, Divider, TextField, Button } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { MultisigAccount, TransactionAccount } from "@sqds/sdk";
import { FC, useState, useEffect } from "react";
import BackHandIcon from "@mui/icons-material/BackHand";
import FlagIcon from "@mui/icons-material/Flag";

interface SettlementProps {
  msState: MultisigAccount;
  isMember: boolean;
  viewer: web3.PublicKey;
}

export const Settlement: FC<SettlementProps> = ({
  msState,
  isMember,
  viewer,
}) => {
  const [recipient, setRecipient] = useState<string>();
  const [settleState, setSettleState] = useState<
    TransactionAccount | undefined
  >();
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const wallet = useWallet();
  const balance = useVaultBalance(msState?.publicKey);
  // console.log("foo", balance);
  const settlement = useSettlement(msState?.publicKey.toString());

  useEffect(() => {
    const fetchTxState = async () => {
      if (settlement?.txPda) {
        const res = await fetch(
          `http://localhost:3000/api/get/txAccount/${settlement.txPda}`,
        );
        const data = await res.json();
        const txState = data.txState as TransactionAccount;

        setSettleState(txState);
      }
    };

    fetchTxState();
  }, [settlement]);

  useEffect(() => {
    if (!settleState || !settleState?.status?.active) {
      console.log("Transaction is not active or settleState doesn't exist");
      return;
    }

    const isApproved = settleState.approved.some(
      (i) => new web3.PublicKey(i) === viewer,
    );
    // console.log(`check approve action`, isApproved);
    setIsApproved(isApproved);
  }, [settleState]);

  useEffect(() => {
    if (!settleState || !settleState.status?.executeReady) {
      console.log("Transaction is not ready or settleState is undefined");
      return;
    }

    const exesuteTx = async () => {
      console.log(settleState);

      const res = await fetch(
        `http://localhost:3000/api/post/executeTx/${settleState.publicKey}`,
        {
          method: "Post",
        },
      );

      const data = await res.json();
      const txState = data.txState as TransactionAccount;

      setSettleState(txState);
      window.location.reload();
    };

    exesuteTx();
  }, [settleState]);

  const handleSettleActive = async () => {
    if (msState?.publicKey && recipient) {
      console.log(recipient);
      const txState = await postActiveSettle(msState.publicKey, recipient);
      // console.log("foo", txState);
      setSettleState(txState);
    }
  };

  const handleApproveTx = async () => {
    if (settleState && wallet) {
      const txState = await approveTxUser(wallet, settleState.publicKey);
      setSettleState(txState);
    }
  };

  return (
    <Paper
      className={`${settleState?.status?.active ? "border-pink-200 border-solid text-white" : settleState?.status?.executed ? "border-red-900 border-solid text-white" : "border-dashed  border-gray-800 text-gray-500"}  bg-black  border-2`}
    >
      {settlement && settlement?.txPda ? (
        <div>
          <div className="flex gap-3 items-center justify-start">
            <Typography variant="h4" className=" ">
              settlement
            </Typography>
            <div className=" flex gap-1 justify-center ">
              <div className="flex gap-1 items-center ">
                <BackHandIcon />
                <Typography variant="h6">
                  {settleState?.approved?.length} / {msState.keys.length}
                </Typography>
              </div>

              <Divider orientation="vertical" variant="middle" flexItem />
              <div className="flex gap-1 items-center">
                <FlagIcon />
                <Typography variant="h6">
                  {msState.threshold} / {msState.keys.length}
                </Typography>
              </div>
            </div>
          </div>
          <div>
            <div>
              <Typography>amount</Typography>
              <Typography>{settlement.amount} SOL</Typography>
            </div>
            <div>
              <Typography>recipient</Typography>
              <Typography>{settlement.recipient}</Typography>
            </div>
          </div>
        </div>
      ) : (
        <>
          {balance && msState && (
            <div>
              <div className="flex gap-3 items-center justify-start">
                <Typography variant="h4" className=" ">
                  settlement
                </Typography>
                <div className="flex gap-1 items-center">
                  <FlagIcon />
                  <Typography variant="h6">
                    {msState.threshold} / {msState.keys.length}
                  </Typography>
                </div>
              </div>

              <div className="p-3">
                <div>
                  <Typography>amount</Typography>
                  <Typography>{balance.balanceSol} SOL (vault max)</Typography>
                </div>
                <TextField
                  label="recipient"
                  variant="standard"
                  // defaultValue={"Crew Dao"}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  sx={{
                    color: "white",
                    backgroundColor: "black",
                    "& .MuiInputBase-input": { color: "gray" },
                    "& .MuiInputLabel-root": { color: "gray" },
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}

      {isMember &&
        (settleState?.status?.executed ? (
          <Button
            className="w-full"
            variant="text"
            sx={{ color: "white", backgroundColor: "black" }}
          >
            Done!
          </Button>
        ) : settleState?.status?.active ? (
          <Button
            className="w-full"
            variant="text"
            onClick={handleApproveTx}
            sx={{ color: "white", backgroundColor: "black" }}
          >
            Approve
          </Button>
        ) : settleState && isApproved ? (
          <Button
            className="w-full"
            variant="text"
            onClick={handleApproveTx}
            sx={{ color: "white", backgroundColor: "black" }}
          >
            Pushed
          </Button>
        ) : (
          <Button
            className="w-full"
            variant="text"
            onClick={handleSettleActive}
            sx={{ color: "white", backgroundColor: "black" }}
          >
            Active
          </Button>
        ))}
    </Paper>
  );
};
