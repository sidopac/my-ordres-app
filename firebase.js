import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALKoYx5Nu31aU-sxQPPLJ87iw6kE3f6nM",
  authDomain: "my-order-mkhzan.firebaseapp.com",
  projectId: "my-order-mkhzan",
  storageBucket: "my-order-mkhzan.firebasestorage.app",
  messagingSenderId: "18878202049",
  appId: "1:18878202049:web:750f350dfecc1ee128d440"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };