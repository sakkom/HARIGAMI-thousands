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
//
export const storeHarigamiCollection = async (
  creator: web3.PublicKey,
  collectionId: PublicKey,
) => {
  try {
    const versionRef = collection(db, "harigamiCollection");

    const setData = {
      harigami: {
        creator: creator.toBase58(),
        collectionId: collectionId.toString(),
      },
    };

    await addDoc(versionRef, setData);
  } catch (err) {
    console.error("Error", err);
  }
};

export const storeVersionIds = async (
  creator: web3.PublicKey,
  candyMachineId: PublicKey,
  collectionId: PublicKey,
  msPda: web3.PublicKey,
) => {
  try {
    const versionRef = collection(db, "Version3");

    const setData = {
      creator: creator.toBase58(),
      machine: {
        candyMachineId: candyMachineId,
        collectionId: collectionId,
      },
      dao: {
        multisigId: msPda,
        txPdas: [],
      },
      settlement: {},
    };

    const docRef = await addDoc(versionRef, setData);

    console.log(`Ok! store candy machine pubKey to firestore:`, docRef.id);
  } catch (err) {
    console.error("Error", err);
  }
};

export const storeTxPda = async (
  multisigPda: web3.PublicKey,
  txPda: web3.PublicKey,
) => {
  try {
    const collectionRef = collection(db, "Version3");

    const q = query(
      collectionRef,
      where("dao.multisigId", "==", multisigPda.toString()),
    );

    const queryShapshot = await getDocs(q);

    if (queryShapshot.empty) {
      return null;
    } else {
      const docSnapshot = queryShapshot.docs[0];
      const docRef = doc(db, "Version3", docSnapshot.id);

      const addData = {
        "dao.txPdas": arrayUnion(txPda.toString()),
      };

      await updateDoc(docRef, addData);
      console.log("update txPdas");
    }
  } catch (err) {
    console.error("Error FireStore", err);
  }
};

export const storeSettleTxPda = async (
  multisigPda: web3.PublicKey,
  txPda: web3.PublicKey,
  recipient: web3.PublicKey,
  amount: number,
  threshold: number,
) => {
  try {
    const collectionRef = collection(db, "Version3");

    const q = query(
      collectionRef,
      where("dao.multisigId", "==", multisigPda.toString()),
    );

    const queryShapshot = await getDocs(q);

    if (queryShapshot.empty) {
      return null;
    } else {
      const docSnapshot = queryShapshot.docs[0];
      const docRef = doc(db, "Version3", docSnapshot.id);

      const addData = {
        settlement: {
          txPda: txPda.toString(),
          recipient: recipient.toString(),
          amount,
          threshold,
        },
      };

      await updateDoc(docRef, addData);
      // console.log("update txPdas");
    }
  } catch (err) {
    console.error("Error FireStore", err);
  }
};
