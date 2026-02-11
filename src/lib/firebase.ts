import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrHdCkcJbcSq8TR9WGHXr4kybiaX39MWQ",
  authDomain: "flugo-ede48.firebaseapp.com",
  projectId: "flugo-ede48",
  storageBucket: "flugo-ede48.firebasestorage.app",
  messagingSenderId: "651488381665",
  appId: "1:651488381665:web:9e327b1706f9d96b2685a0",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
