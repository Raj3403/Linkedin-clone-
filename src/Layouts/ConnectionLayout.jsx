import React, { useMemo, useState } from "react";
import { getCurrentUser } from "../api/FirestoreAPI";
import Connections from "../Pages/Connections";
import Topbar from "../Components/Common/Topbar";
function ConnectionLayout() {
  const [currentUser, setCurrentUser] = useState();
  useMemo(() => {
    getCurrentUser(setCurrentUser);
  }, []);
  return (
    <div>
      <Topbar />
      <Connections currentUser={currentUser} />
    </div>
  );
}

export default ConnectionLayout;
