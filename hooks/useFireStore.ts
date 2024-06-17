import * as web3 from "@solana/web3.js";
import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { app } from "@/firebase.config";
import { PublicKey } from "@metaplex-foundation/umi";

const db = getFirestore(app);

export const useCandyIds = (): string[] => {
  const [candyIds, setCandyIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let data: string[] = [];
      try {
        const querySnapshot = await getDocs(collection(db, "Version"));

        querySnapshot.forEach((doc) => {
          const id = doc.data().candyId;
          // console.log(id);
          data.push(id);
        });

        setCandyIds(data);
        console.log("FireStoreからCMIDを取得");
      } catch (err) {
        console.error("Error", err);
      }
    };

    fetchData();
  }, []);

  return candyIds;
};

export const useSquadId = (candyId: PublicKey) => {
  const [squadId, setSquadId] = useState<web3.PublicKey>();

  const candyId_str = candyId.toString();
  console.log("store check");
  useEffect(() => {
    const fetchSquadId = async () => {
      const versionRef = collection(db, "Version");

      const q = query(versionRef, where("candyId", "==", candyId_str));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return null;
      else {
        const squadId = querySnapshot.docs[0].data().squadId;
        console.log(squadId);
        const squadId_pubKey = new web3.PublicKey(squadId);
        setSquadId(squadId_pubKey);
      }
    };

    fetchSquadId();
  }, []);

  return squadId;
};
