import React, { useMemo, useState } from "react";
import { getCurrentUser } from "../api/FirestoreAPI";
import Home from "../Pages/Home";
import Topbar from "../Components/Common/Topbar";
function HomeLayouts() {
  const [currentUser, setCurrentUser] = useState();
  useMemo(() => {
    getCurrentUser(setCurrentUser);
  }, []);
  return (
    <div>
      <Topbar  currentUser={currentUser} />
      <Home currentUser={currentUser} />
    </div>
  );
}

export default HomeLayouts;
