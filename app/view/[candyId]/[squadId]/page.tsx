"use client";
import { FC, useContext, useEffect, useState } from "react";
import * as web3 from "@solana/web3.js";
import { Button, Chip, Paper, Typography } from "@mui/material";
import {
  useSquadAccount,
  useProposalsDetail,
  useVaultBalance,
} from "@/hooks/useDao";
import Link from "next/link";
import Squads from "@sqds/sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import GroupsIcon from "@mui/icons-material/Groups";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { useTxPdas } from "@/hooks/useStored";
import { filterActiveOrReadyTransactions } from "@/utils/squads";
import { TransactionDetail } from "@/types/customTypes";

export default function Page({ params }: { params: { squadId: string } }) {
  const squadId = params.squadId;
  const wallet = useWallet();
  const squadAccount = useSquadAccount(squadId);
  const txPdas = useTxPdas(new web3.PublicKey(squadId));
  const proposalsDetail: any[] = useProposalsDetail(wallet, txPdas);

  console.log(proposalsDetail);

  const member = squadAccount?.keys;

  const squadId_pubKey = squadAccount?.publicKey;

  const member_len = squadAccount?.keys.length;

  const threshold = squadAccount?.threshold;

  if (squadId_pubKey === undefined) return null;

  return (
    <div className="flex flex-col mobile-like">
      <DaoOverview
        squadId={squadId_pubKey}
        member={member_len}
        threshold={threshold}
      />
      <MiniPublics member={member} detail={proposalsDetail} />
    </div>
  );
}

interface MiniPublicsProps {
  member: web3.PublicKey[] | undefined;
  detail: TransactionDetail[];
}

const MiniPublics: FC<MiniPublicsProps> = ({ member, detail }) => {
  const wallet: any = useWallet();
  const [proposals, setProposals] = useState<TransactionDetail[]>([]);
  const [memberFrom, setMemberFrom] = useState<number>(0);
  const [memberTo, setMemberTo] = useState<number>(0);

  useEffect(() => {
    const activeOrReadyTransaction = filterActiveOrReadyTransactions(detail);
    setProposals(activeOrReadyTransaction);
  }, [detail]);

  // if (detail.length === 0) {
  //   console.log("detail no");
  // }

  useEffect(() => {
    const member_from = member?.length ?? 0;
    let member_to = member_from;
    member_to++;

    setMemberFrom(member_from);
    setMemberTo(member_to);
  }, []);

  const handleApprove = async (wallet: any, transaction: web3.PublicKey) => {
    const squads = Squads.devnet(wallet, { commitmentOrConfig: "confirmed" });
    const txState = await squads.approveTransaction(transaction);
    console.log(txState);
    // const status = txState.status;
    // setProposalStatus(status);
  };

  return (
    <div className="w-full">
      <Paper className="blackGlassPaper">
        <Typography variant="h4" className="text-center">
          Mini-publics
        </Typography>
        {/* transactionある場合のみ表示 */}
        {proposals?.map((item, index) => (
          <Paper key={index} className="blackGlassPaper m-5">
            <div className="flex justify-end">
              {item.status.active && (
                <Chip
                  label="Active"
                  color="primary"
                  variant="filled"
                  size="small"
                  sx={{
                    color: "black",
                  }}
                />
              )}
              {item.status.executeReady && (
                <Chip
                  label="Execute Ready"
                  color="secondary"
                  variant="filled"
                  size="small"
                  sx={{
                    color: "black",
                  }}
                />
              )}
            </div>
            <div className="flex w-full justify-center">
              <div className="flex m-3 gap-3 items-center">
                <GroupsIcon />
                <Typography variant="h6">
                  From {memberFrom} to {memberTo}
                </Typography>
              </div>
              <div className="flex m-3 gap-3 items-center">
                <HowToVoteIcon />
                <Typography variant="h6">From x to x</Typography>
              </div>
            </div>

            {item.status.active && (
              <Button
                onClick={() => handleApprove(wallet, item.publicKey)}
                className="w-full"
                variant="outlined"
                sx={{ color: "white", backgroundColor: "black" }}
              >
                Approve
              </Button>
            )}

            {/* <Button onClick={() => handleApprove(wallet)}>Approve</Button> */}
            {item.status.executeReady && (
              <Button
                className="w-full"
                // onClick={() => handleExecute(wallet, item.publicKey)}
                variant="outlined"
                sx={{ color: "white", backgroundColor: "black" }}
              >
                Excecute
              </Button>
            )}
          </Paper>
        ))}

        {/* list */}
        {member?.map((item, index) => (
          <Typography variant="body1" key={index}>
            {item.toBase58()}
          </Typography>
        ))}
      </Paper>
    </div>
  );
};

interface DaoOverviewProps {
  squadId: web3.PublicKey;
  member: number | undefined;
  threshold: number | undefined;
}

const DaoOverview: FC<DaoOverviewProps> = ({ squadId, member, threshold }) => {
  const vaultBalanceInfo = useVaultBalance(squadId);
  return (
    <div className="w-full">
      <Link href={`https://solana.fm/address/${squadId}/transactions`}>
        <Paper className="blackGlassPaper flex flex-col items-center">
          <Typography variant="h3" color={"pink"}>
            HARIGAMI-dao
          </Typography>
        </Paper>
      </Link>

      <Link
        href={`https://solana.fm/address/${vaultBalanceInfo.publicKey}/transactions`}
      >
        <Paper className="blackGlassPaper  flex flex-col items-center">
          {vaultBalanceInfo && (
            <Typography variant="h2">{vaultBalanceInfo.balance}</Typography>
          )}
          <div className="felx">
            <Typography variant="h5" color={"pink"}>
              vault
            </Typography>
          </div>
        </Paper>
      </Link>

      <div className="flex">
        <Paper className="blackGlassPaper w-full flex flex-col items-center">
          <Typography variant="h5">{member}</Typography>
          <Typography variant="h5">member</Typography>
        </Paper>
        <Paper className="blackGlassPaper w-full flex flex-col items-center">
          <Typography variant="h5">{threshold}</Typography>
          <Typography variant="h5">threshold</Typography>
        </Paper>
      </div>
    </div>
  );
};
