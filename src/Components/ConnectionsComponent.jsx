import React, { useEffect, useState } from "react";
import { getAllUsers } from "../api/FirestoreAPI";
import ConnectedUsers from "./Common/ConnectedUsers";
import "../Sass/ConnectionsComponent.scss";

function ConnectionsComponent() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getAllUsers(setUsers);
  }, []);

  return (
    <div className="connections-main">
      {users.map((user) => {
        return <ConnectedUsers user={user} />;
      })}
    </div>
  );
}

export default ConnectionsComponent;
