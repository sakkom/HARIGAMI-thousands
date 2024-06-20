import * as web3 from "@solana/web3.js";

export async function postMultisig(
  threshold: number,
  initialMembers: web3.PublicKey[],
) {
  const data = {
    threshold: threshold,
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
