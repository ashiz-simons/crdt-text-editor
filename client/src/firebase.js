// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyDIJ4zBQxVYA8p4Mot4Y5ne-ikDdrk6-Lk",
  authDomain: "text-editor-d0df4.firebaseapp.com",
  projectId: "text-editor-d0df4",
  storageBucket: "text-editor-d0df4.firebasestorage.app",
  messagingSenderId: "172501104603",
  appId: "1:172501104603:web:5e332f5821bab6def059fe",
  measurementId: "G-TBK8PRQJXM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
