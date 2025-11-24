import React, { useEffect , useState} from "react";
import ProfileComponent from "../Components/ProfileComponent";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import Loader from "../Components/Common/Loader/Loader";

function Profile({currentUser}) {
    const [loading , setLoading] = useState(true);
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
      

      
  return loading ? <Loader/> : <ProfileComponent currentUser={currentUser}/>;
  
}

export default Profile;
