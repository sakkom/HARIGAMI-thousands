import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, //upload file
  authDomain: "harigamidev.firebaseapp.com",
  projectId: "harigamidev",
  storageBucket: "harigamidev.appspot.com",
  messagingSenderId: "410159250052",
  appId: "1:410159250052:web:aa8b389cea5cc84ab360d1"
};

export const app = initializeApp(firebaseConfig);
