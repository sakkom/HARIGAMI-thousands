import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/firebase.config";

const db = getFirestore(app);

export const useCandyIds = (): string[] => {
  const [candyIds, setCandyIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let data: string[] = [];
      try {
        const querySnapshot = await getDocs(collection(db, "cmid"));

        querySnapshot.forEach((doc) => {
          const id = doc.data().pubKey;
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
