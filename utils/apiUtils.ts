import * as web3 from "@solana/web3.js";
import { TransactionAccount } from "@sqds/sdk";

export async function postMultisig(initialMembers: web3.PublicKey[]) {
  const data = {
    initialMembers: initialMembers,
  };

  const response = await fetch(
    "http://localhost:3000/api/post/createMultisig",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export async function postAddMember(
  multisigPda: web3.PublicKey,
  member: web3.PublicKey,
) {
  const res = await fetch("http://localhost:3000/api/post/addMember", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      multisigPda,
      member,
    }),
  });

  if (!res.ok) {
    throw new Error("res was not ok");
  }

  const txState = res.json() as Promise<TransactionAccount>;

  return txState;
}

export async function postActiveSettle(
  msPda: web3.PublicKey,
  recipient: string,
) {
  const res = await fetch("http://localhost:3000/api/post/transfer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      msPda,
      recipient,
    }),
  });

  if (!res.ok) {
    throw new Error("res was not ok");
  }

  const data = await res.json();

  const txState = data.firstTxState as TransactionAccount;

  return txState;
}
