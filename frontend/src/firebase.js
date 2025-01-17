// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQ4dZ9FkPn1t6cK_6hwROBpltKbh1MbEY",
  authDomain: "cartpractice-ac148.firebaseapp.com",
  projectId: "cartpractice-ac148",
  storageBucket: "cartpractice-ac148.appspot.com",
  messagingSenderId: "588147829393",
  appId: "1:588147829393:web:79e21ad9646f7d0542ed30",
  measurementId: "G-NNNCSPEPPE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const auth=getAuth();