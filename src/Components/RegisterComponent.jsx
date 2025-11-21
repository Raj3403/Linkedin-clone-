import React, { useState } from "react";
import { RegisterAPI, GoogleSignInAPI } from "../api/AuthApi";
import linkedinLogo from "../assets/linkedinLogo.png";
import GoogleButton from "react-google-button";
import { useNavigate } from "react-router-dom";
import { postUserData } from "../api/FirestoreAPI";
import "../Sass/LoginComponent.scss";
import { toast } from "react-toastify";
import { getUniqueId } from "../helpers/getUniqueId";

export default function RegisterComponent() {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({});
  const register = async () => {
    console.log(credentials);
    try {
      let res = await RegisterAPI(credentials.email, credentials.password);
      toast.success("Account Created!");
      postUserData({ userID: getUniqueId(), name: credentials.name, email: credentials.email });
      navigate("/home");
      localStorage.setItem("userEmail", res.user.email);
    } catch (err) {
      console.log(err);
      toast.err("Cannot Create your Account");
    }
  };

  const googleSignIn = () => {
    let res = GoogleSignInAPI();
    navigate("/home");
  };
  return (
    <div className="login-wrapper">
      <img src={linkedinLogo} className="linkedinLogo" />
      <div className="login-wrapper-inner">
        <h1 className="heading">Make the most of your professional life</h1>
        <div className="auth-inputs">
          <input
            onChange={(event) =>
              setCredentials({ ...credentials, name: event.target.value })
            }
            type="text"
            className="common-input"
            placeholder="Your Name"
          />

          <input
            onChange={(event) =>
              setCredentials({ ...credentials, email: event.target.value })
            }
            type="email"
            className="common-input"
            placeholder="Email or Phone Number"
          />
          <input
            onChange={(event) =>
              setCredentials({ ...credentials, password: event.target.value })
            }
            type="password"
            className="common-input"
            placeholder="Password (6 or more characters)"
          />
        </div>
        <button onClick={register} className="login-btn">
          Agree & Join
        </button>
      </div>
      <hr className="hr-text" data-content="or" />
      <div className="google-btn-container ">
        <GoogleButton className="google-btn" onClick={googleSignIn} />

        <p className="go-to-signup">
          Already on Linkedin?{" "}
          <span className="join-now" onClick={() => navigate("/")}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
