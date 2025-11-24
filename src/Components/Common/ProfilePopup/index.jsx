import React, { useState, useEffect } from "react";
import { onLogout } from "../../../api/AuthApi";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../../api/FirestoreAPI";
import "./index.scss";
import Button from "../Button";

export default function ProfilePopup() {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    getCurrentUser(setCurrentUser);
  }, []);
  return (
    <div className="popup-card">
      <p className="name">{currentUser?.name}</p>
      <p className="headline">{currentUser?.headline}</p>
      <Button
        title="View Profile"
        onClick={() =>
          navigate("/profile", { state: { id: currentUser?.userID , email:currentUser.email } })
        }
      />
      <Button
        title="Logout"
        onClick={onLogout}
      />
    </div>
  );
}
