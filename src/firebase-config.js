// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBb4cs04tIQUsygOKPZ0EzYj3ATmc_-Tew",
  authDomain: "herbam08.firebaseapp.com",
  projectId: "herbam08",
  storageBucket: "herbam08.appspot.com",
  messagingSenderId: "105430900236",
  appId: "1:105430900236:web:119cfaf9e1de51356d9829"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);