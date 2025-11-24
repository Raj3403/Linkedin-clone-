import React, { useEffect, useState } from "react";
import HomeComponent from "../Components/HomeComponent";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Common/Loader/Loader.jsx";

function Home({ currentUser }) {
  const [loading, setLoading] = useState(true);
  let Navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (res) => {
      if (!res?.accessToken) {
        Navigate("/");
      } else {
        setLoading(false);
      }
    });
  }, []);
  return loading ? <Loader /> : <HomeComponent currentUser={currentUser} />;
  // (<div>
  //   <HomeComponent />
  // </div>)
}

export default Home;
