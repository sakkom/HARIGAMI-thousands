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
        const querySnapshot = await getDocs(collection(db, "Version3"));

        querySnapshot.forEach((doc) => {
          const candyMachineId = doc.data().machine.candyMachineId;
          // console.log(id);
          data.push(candyMachineId);
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

export const useStoredMsId = (collectionId: string) => {
  const [multisigPda, setMultisigPda] = useState<string>();

  useEffect(() => {
    const fetchSquadId = async () => {
      const versionRef = collection(db, "Version3");

      const q = query(
        versionRef,
        where("machine.collectionId", "==", collectionId),
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return null;
      else {
        const msId = querySnapshot.docs[0].data().dao.multisigId;
        setMultisigPda(msId);
      }
    };

    fetchSquadId();
  }, []);

  return multisigPda;
};

export const useTxPdas = (msPda: string) => {
  const [txPdas, setTxPdas] = useState<string[]>([]);

  useEffect(() => {
    const fetchProposal = async () => {
      const collectionRef = collection(db, "Version3");

      const q = query(collectionRef, where("dao.multisigId", "==", msPda));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      } else {
        const docSnapShot = querySnapshot.docs[0];

        if (docSnapShot && docSnapShot.data()) {
          const txPdas = docSnapShot.data().dao.txPdas;
          setTxPdas(txPdas);
        } else {
          console.log("don't get docSnapshot");
        }
      }
    };
    fetchProposal();
  }, []);

  return txPdas;
};

export const useSettlement = (msPda: string) => {
  const [settlement, setSettlement] = useState<any>();

  useEffect(() => {
    const fetchProposal = async () => {
      const collectionRef = collection(db, "Version3");

      const q = query(collectionRef, where("dao.multisigId", "==", msPda));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      } else {
        const docSnapShot = querySnapshot.docs[0];

        if (docSnapShot && docSnapShot.data()) {
          const data = docSnapShot.data().settlement;
          console.log(data);
          setSettlement(data);
        } else {
          console.log("don't get docSnapshot");
        }
      }
    };
    fetchProposal();
  }, []);

  return settlement;
};

//// /new/vuew

export const useStoredCollectionIds = (): string[] => {
  const [colIds, setColIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let data: string[] = [];
      try {
        const querySnapshot = await getDocs(collection(db, "Version3"));

        querySnapshot.forEach((doc) => {
          const candyMachineId = doc.data().machine.collectionId;
          // console.log(id);
          data.push(candyMachineId);
        });

        setColIds(data);
      } catch (err) {
        console.error("Error", err);
      }
    };

    fetchData();
  }, []);

  return colIds;
};

export const useStoredCandyId = (collectionId: string) => {
  const [candyId, setCandyId] = useState<string>();

  useEffect(() => {
    if (!collectionId) return;

    const fetchCandyId = async () => {
      const versionRef = collection(db, "Version3");

      const q = query(
        versionRef,
        where("machine.collectionId", "==", collectionId),
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return null;
      else {
        const candyId = querySnapshot.docs[0].data().machine.candyMachineId;
        // console.log("foo", candyId);
        setCandyId(candyId);
      }
    };

    fetchCandyId();
  }, [collectionId]);

  return candyId;
};

export const useStoredHarigamiCollection = () => {
  const [col, setCols] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let data: string[] = [];
      try {
        const querySnapshot = await getDocs(
          collection(db, "harigamiCollection"),
        );

        querySnapshot.forEach((doc) => {
          const candyMachineId = doc.data().harigami.collectionId;
          // console.log(id);
          data.push(candyMachineId);
        });

        setCols(data);
        // console.log("FireStoreからCMIDを取得");
      } catch (err) {
        console.error("Error", err);
      }
    };

    fetchData();
  }, []);

  return col;
};
