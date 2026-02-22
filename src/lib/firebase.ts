import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-X2H5RnKGhTbYS84TwWZYTuowgd_0TGg",
  authDomain: "plantrise.firebaseapp.com",
  projectId: "plantrise",
  storageBucket: "plantrise.firebasestorage.app",
  messagingSenderId: "1093108124518",
  appId: "1:1093108124518:web:0fd158ccb658ad0328d6a7",
  measurementId: "G-G7HK581G7M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
