import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

export const LoginAPI = async (email, password) => {
  try {
    let response = await signInWithEmailAndPassword(auth, email, password);
    return response;
  } catch (err) {
    throw err;
  }
};

export const RegisterAPI = async (email, password) => {
  try {
    let response = await createUserWithEmailAndPassword(auth, email, password);
    return response;
  } catch (err) {
    return err;
  }
};

export const GoogleSignInAPI = () => {
  try {
    let googleProvider = new GoogleAuthProvider();
    let res = signInWithPopup(auth, googleProvider);
    return res;
  } catch (err) {
    return err;
  }
};

export const onLogout = () => {
  try {
    signOut(auth);
  } catch (err) {
    return err;
  }
};
