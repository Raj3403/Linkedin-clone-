import React, { useEffect, useState } from "react";
import ConnectionsComponent from "../Components/ConnectionsComponent.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Common/Loader/Loader.jsx";

function Connections({ currentUser }) {
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
  return loading ? <Loader /> : <ConnectionsComponent currentUser={currentUser} />;
  // (<div>
  //   <HomeComponent />
  // </div>)
}

export default Connections;
