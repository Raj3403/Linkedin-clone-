import React from "react";

function ConnectedUsers( {user} ) {
  return <div>
    <p>{user.name}</p>
    <p>{user.headline}</p>
  </div>;
}

export default ConnectedUsers;
