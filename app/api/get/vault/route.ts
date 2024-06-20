// import "dotenv/config";
// import * as web3 from "@solana/web3.js";
// import Squads, {
//   DEFAULT_MULTISIG_PROGRAM_ID,
//   getAuthorityPDA,
// } from "@sqds/sdk";
// import { initializeSquadsSDK } from "@/lib/squads";
// import BN from "bn.js";

// interface vaultProps {
//   multisigPda: string;
// }

// export async function GET(
//   request: Request,
//   { params }: { params: { multisigPda: string } },
// ) {
//   const { multisigPda }: vaultProps = await request.json();

//   const multisigPda_pubKey = new web3.PublicKey(multisigPda);

//   const squads = initializeSquadsSDK();

//   const [vault] = getAuthorityPDA(
//     multisigPda_pubKey,
//     new BN(1),
//     DEFAULT_MULTISIG_PROGRAM_ID,
//   );

//   return Response.json({ vault: vault.toString() });
// }
