// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";;
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNEquWTLk-gCP2WID2rc9jNFp_aE6_iCI",
  authDomain: "linkedin-clone-32e35.firebaseapp.com",
  projectId: "linkedin-clone-32e35",
  storageBucket: "linkedin-clone-32e35.firebasestorage.app",
  messagingSenderId: "1039212663583",
  appId: "1:1039212663583:web:bfbac53d73e7876f58d62a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
export {auth , app , firestore , storage};