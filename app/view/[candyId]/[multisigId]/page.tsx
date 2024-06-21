"use client";
import { FC, useContext, useEffect, useState } from "react";
import * as web3 from "@solana/web3.js";
import {
  Button,
  Chip,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  useMultisigAccount,
  useTxAccounts,
  useVaultBalance,
} from "@/hooks/useDao";
import Link from "next/link";
import Squads, { TransactionAccount, Wallet } from "@sqds/sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import GroupsIcon from "@mui/icons-material/Groups";
import FlagIcon from "@mui/icons-material/Flag";
import BackHandIcon from "@mui/icons-material/BackHand";
import { useSettleTxPda, useTxPdas } from "@/hooks/useStored";
import { filterActiveTx, filterExecuteReadyTx, getVault } from "@/utils/squads";
import { postActiveSettle } from "@/utils/apiUtils";

export default function Page({ params }: { params: { multisigId: string } }) {
  const multisigPda = params.multisigId;
  const { publicKey } = useWallet();

  const { msPda, threshold, members } = useMultisigAccount(multisigPda);

  const [isMember, setIsMember] = useState<boolean>(false);

  useEffect(() => {
    if (publicKey && members) {
      const isMemberCheck = members.some(
        (member) => member.toBase58() === publicKey.toBase58(),
      );
      setIsMember(isMemberCheck);
    }
  }, [publicKey, members]);

  return (
    <div className="flex flex-col mobile-like">
      {msPda && (
        <div>
          <DaoExplorer msPda={msPda} />
          <DaoOverview
            multisigPda={msPda}
            members={members}
            threshold={threshold}
          />
          <MiniPublics members={members} multisigPda={msPda} />
          <SettleDraft msPda={msPda} isMember={isMember} />
        </div>
      )}
    </div>
  );
}

interface DaoExplorerProps {
  msPda: web3.PublicKey;
}

const DaoExplorer: FC<DaoExplorerProps> = ({ msPda }) => {
  const vault = getVault(msPda);

  return (
    <div>
      <div className="flex gap-5">
        <Typography variant="body1">Squads App</Typography>
        <Link href={`https://devnet.squads.so/squads`}>
          <Typography variant="body1" color={"pink"}>
            https://devnet.squads.so/squads
          </Typography>
        </Link>
      </div>
      {msPda && (
        <Link href={`https://solana.fm/address/${msPda}/transactions`}>
          <div className="flex gap-5">
            <Typography variant="body1">Multisig Account</Typography>
            <Typography variant="body1" color={"pink"}>
              https://solana.fm/address/
            </Typography>
          </div>
        </Link>
      )}
      {vault && (
        <Link href={`https://solana.fm/address/${vault}/transactions`}>
          <div className="flex gap-5">
            <Typography variant="body1">Vault Account</Typography>
            <Typography variant="body1" color={"pink"}>
              https://solana.fm/address/
            </Typography>
          </div>
        </Link>
      )}
    </div>
  );
};

interface MiniPublicsProps {
  members: web3.PublicKey[] | undefined;
  multisigPda: web3.PublicKey;
}

const MiniPublics: FC<MiniPublicsProps> = ({ members, multisigPda }) => {
  const wallet = useWallet();
  const user = wallet?.publicKey;

  const txPdas: string[] = useTxPdas(multisigPda.toString());
  const txAccounts: TransactionAccount[] = useTxAccounts(txPdas);
  // console.log(txAccounts);
  const [activeTxs, setActiveTxs] = useState<TransactionAccount[]>([]);
  const [isMember, setIsMember] = useState<boolean>(false);

  useEffect(() => {
    if (user && members) {
      const isMemberCheck = members.some(
        (member) => member.toBase58() === user.toBase58(),
      );
      setIsMember(isMemberCheck);
    }
  }, [user, members]);

  useEffect(() => {
    const activeTxs = filterActiveTx(txAccounts);
    console.log(activeTxs);
    setActiveTxs(activeTxs);
  }, [txAccounts]);

  useEffect(() => {
    const readyTxs = filterExecuteReadyTx(txAccounts);

    const exesuteTx = async () => {
      const responses = await Promise.all(
        readyTxs.map(async (tx) => {
          const res = await fetch(
            `http://localhost:3000/api/post/executeTx/${tx.publicKey}`,
            {
              method: "Post",
            },
          );
          return res.json() as Promise<TransactionAccount>;
        }),
      );
      console.log(responses);
    };

    if (readyTxs.length > 0) {
      exesuteTx();
    }
  }, [txAccounts]);

  const handleApprove = async (wallet: any, transaction: web3.PublicKey) => {
    const squads = Squads.devnet(wallet, { commitmentOrConfig: "confirmed" });
    const txState = await squads.approveTransaction(transaction);
  };

  return (
    <div className="w-full">
      {/* transactionある場合のみ表示 */}

      <Paper className="blackGlassPaper">
        <Typography variant="h5">pending</Typography>
        {activeTxs?.map((tx, index) => (
          <Paper key={index} className="blackGlassPaper m-5">
            <div className="flex justify-between px-3">
              <div className="flex m-3 gap-3 items-center">
                <GroupsIcon fontSize="medium" />
                <Typography variant="h6">New Member!</Typography>
              </div>
              <div className=" flex gap-3 justify-center">
                <div className="flex gap-3 items-center ">
                  <BackHandIcon fontSize="medium" />
                  <Typography variant="h6">
                    {tx.approved.length} / {members?.length}
                  </Typography>
                </div>
                <Divider orientation="vertical" variant="middle" flexItem />
                <div className="flex gap-3 items-center">
                  <FlagIcon fontSize="medium" />
                  <Typography variant="h6">2 / {members?.length}</Typography>
                </div>
              </div>
            </div>

            {isMember && (
              <Button
                onClick={() => handleApprove(wallet, tx.publicKey)}
                className="w-full"
                variant="outlined"
                sx={{ color: "white", backgroundColor: "black" }}
              >
                Approve
              </Button>
            )}
          </Paper>
        ))}
      </Paper>
    </div>
  );
};

interface DaoOverviewProps {
  multisigPda: web3.PublicKey;
  members: web3.PublicKey[];
  threshold: string | undefined;
}

const DaoOverview: FC<DaoOverviewProps> = ({
  multisigPda,
  members,
  threshold,
}) => {
  const { balanceSol, vaultPda, balanceUsd } = useVaultBalance(multisigPda);

  return (
    <div className="w-full">
      <Paper className="blackGlassPaper flex flex-col items-start">
        <Typography variant="h3">harigami dao</Typography>
      </Paper>

      <Paper className="blackGlassPaper  flex flex-col items-start">
        <div className="felx">
          <Typography variant="h5">net worth</Typography>
          {balanceUsd && <Typography variant="h3">${balanceUsd}</Typography>}
        </div>
      </Paper>

      <Paper className="blackGlassPaper">
        <div className="flex gap-3 justify-start">
          <Typography variant="h4">validater</Typography>
          <div className="flex gap-3 items-center">
            <FlagIcon fontSize="medium" />
            <Typography variant="h6">2 / {members?.length}</Typography>
          </div>
        </div>

        {members?.map((item, index) => (
          <Typography variant="body1" key={index}>
            {item.toBase58()}
          </Typography>
        ))}
      </Paper>
    </div>
  );
};

interface SettleDraftProps {
  msPda: web3.PublicKey;
  isMember: boolean;
}

const SettleDraft: FC<SettleDraftProps> = ({ msPda, isMember }) => {
  const [recipient, setRecipient] = useState<string>();
  const balance = useVaultBalance(msPda);
  const initialSettle = useSettleTxPda(msPda.toString());

  const handleSettileActive = async () => {
    // if(recipient is web3.PublicKey)
    if (msPda && recipient) {
      console.log(recipient);
      const res = await postActiveSettle(msPda, recipient);
      console.log("active mode");
    }
  };

  return (
    <Paper
      className={`${initialSettle ? "border-pink-200 border-solid text-white" : "border-dashed  border-gray-800 text-gray-500"}  bg-black  border-2`}
    >
      <div className="flex gap-3 items-center justify-start">
        <Typography variant="h4" className=" ">
          settle
        </Typography>
        <div className=" flex gap-1 justify-center ">
          <div className="flex gap-1 items-center ">
            <BackHandIcon />
            <Typography variant="h6">0 / 3</Typography>
          </div>
          <Divider orientation="vertical" variant="middle" flexItem />
          <div className="flex gap-1 items-center">
            <FlagIcon />
            <Typography variant="h6">2 / 3</Typography>
          </div>
        </div>
      </div>

      {balance.balanceSol && (
        <div>
          {/* <Typography variant="h4" className="text-center">
            {balance.balanceSol} SOL
          </Typography> */}

          <TextField
            className="ms-3"
            label="max"
            variant="standard"
            defaultValue={`${balance.balanceSol}SOL`}
            InputProps={{ readOnly: true }}
            sx={{
              color: "white",
              backgroundColor: "black",
              "& .MuiInputBase-input": { color: "gray" },
              "& .MuiInputLabel-root": { color: "gray" },
            }}
          />
        </div>
      )}

      <TextField
        className="ml-3 mb-3"
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

      {isMember && (
        <Button
          className="w-full"
          variant="text"
          onClick={handleSettileActive}
          sx={{ color: "white", backgroundColor: "black" }}
        >
          {initialSettle ? "Approve" : "Active"}
        </Button>
      )}
    </Paper>
  );
};
