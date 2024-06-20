import * as web3 from "@solana/web3.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  arrayUnion,
  updateDoc,
  doc,
} from "firebase/firestore";
import { app } from "@/firebase.config";
import { PublicKey } from "@metaplex-foundation/umi";
const db = getFirestore(app);

// export const storeCandyMachineId = async (candyMachineId: PublicKey) => {
//   try {
//     const docRef = await addDoc(collection(db, "cmid"), {
//       pubKey: candyMachineId,
//     });

//     console.log(`Ok! store candy machine pubKey to firestore:`, docRef.id);
//   } catch (err) {
//     console.error("Error", err);
//   }
// };

export const storeVersionIds = async (
  candyMachineId: PublicKey,
  collectionId: PublicKey,
  msPda: web3.PublicKey,
) => {
  try {
    const versionRef = collection(db, "Version2");

    const setData = {
      machine: {
        candyMachineId: candyMachineId,
        collectionId: collectionId,
      },
      dao: {
        multisigId: msPda,
        txPdas: [],
      },
    };

    const docRef = await addDoc(versionRef, setData);

    console.log(`Ok! store candy machine pubKey to firestore:`, docRef.id);
  } catch (err) {
    console.error("Error", err);
  }
};

export const storeProposal = async (
  squadId: web3.PublicKey,
  txPda: web3.PublicKey,
) => {
  try {
    const collectionRef = collection(db, "Version2");

    const q = query(
      collectionRef,
      where("dao.squadId", "==", squadId.toString()),
    );

    const queryShapshot = await getDocs(q);

    if (queryShapshot.empty) {
      return null;
    } else {
      const docSnapshot = queryShapshot.docs[0];
      const docRef = doc(db, "Version2", docSnapshot.id);

      const addData = {
        "dao.proposals": arrayUnion(txPda.toString()),
      };

      await updateDoc(docRef, addData);
      console.log("update proposals");
    }
  } catch (err) {
    console.error("Error FireStore", err);
  }
};
