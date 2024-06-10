import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "@/firebase.config";
import { PublicKey } from "@metaplex-foundation/umi";
const db = getFirestore(app);

export const storeCandyMachineId = async (candyMachineId: PublicKey) => {
  try {
    const docRef = await addDoc(collection(db, "cmid"), {
      pubKey: candyMachineId,
    });

    console.log(`Ok! store candy machine pubKey to firestore:`, docRef.id);
  } catch (err) {
    console.error("Error", err);
  }
};
