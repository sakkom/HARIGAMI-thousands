import { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { app } from "@/firebase.config";

const db = getFirestore(app);

export const addData = async () => {
  try {
    const docRef = await addDoc(collection(db, "cmid"), {
      pubKey: "9zV39hyCP1NWtSzB9at7B2J5LEL4vkxwPQaw2F7Qdhm6",
    });

    // console.log(docRef.id);
  } catch (err) {
    console.error("Error", err);
  }
};

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
