// import "dotenv/config";
// import * as web3 from "@solana/web3.js";
// import { initializeSquadsSDK } from "@/lib/squads";
// import {
//   getIxPDA,
//   DEFAULT_MULTISIG_PROGRAM_ID,
//   InstructionAccount,
// } from "@sqds/sdk";
// import BN from "bn.js";

// export async function GET(
//   request: Request,
//   { params }: { params: { txPda: string } },
// ) {
//   const txPda = new web3.PublicKey(params.txPda);

//   const squads = initializeSquadsSDK();

//   const [ixPda] = getIxPDA(txPda, new BN(1), DEFAULT_MULTISIG_PROGRAM_ID);
//   console.log(ixPda);
//   const ixAccount = await squads.getInstruction(ixPda);
//   console.log(ixAccount);

//   return Response.json(ixAccount);
// }
