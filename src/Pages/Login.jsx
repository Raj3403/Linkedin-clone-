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
    onAuthStateChanged(auth , res => {
      if(res?.accessToken){
        Navigate('/home')
      }
       else{
        // return <Loader/>
        setLoading(false)
      }
    });
  }, []);
  return loading? <Loader/> : <LoginComponent />;
}


