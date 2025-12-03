import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../api/FirestoreAPI";
import Topbar from "../Components/Common/Topbar";
import Profile from "../Pages/Profile";

function ProfileLayout() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    getCurrentUser(setCurrentUser);
  }, []);

  return (
    <div>
      <Topbar currentUser={currentUser} />
      <Profile currentUser={currentUser} />
    </div>
  );
}

export default ProfileLayout;
