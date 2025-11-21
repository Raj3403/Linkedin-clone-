import React, { useState } from "react";
import ProfileCard from "../Components/Common/ProfileCard";
import ProfileEdit from "./Common/ProfileEdit";

function ProfileComponent({ currentUser }) {
  const [isEdit, setisEdit] = useState(false);

  const onEdit = () => {
    setisEdit(!isEdit);
  };

  return (
    <div>
      {isEdit ? (
        <ProfileEdit onEdit={onEdit} currentUser={currentUser} />
      ) : (
        <ProfileCard currentUser={currentUser} onEdit={onEdit} />
      )}
    </div>
  );
}

export default ProfileComponent;
