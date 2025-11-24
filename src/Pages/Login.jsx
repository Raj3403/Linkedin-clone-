import React , { useEffect, useState }from "react";
import LoginComponent from "../Components/LoginComponent";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Common/Loader/Loader";



export default function Login() {
  const [loading , setLoading] = useState(true)
  let Navigate = useNavigate()
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("login data", user);
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("userEmail", user.email);

      const token = await user.getIdToken();
      localStorage.setItem("accessToken", token);

      setLoading(false); // user is logged in
    } else {
      // user logged out
      localStorage.removeItem("uid");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("accessToken");
      setLoading(false);
    }
  });

  return () => unsubscribe(); // clean up listener on unmount
}, []);

  return loading? <Loader/> : <LoginComponent />;
}


