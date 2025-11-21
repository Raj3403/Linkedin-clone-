import React, { useState, useMemo, useEffect } from "react";
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
          navigate("/profile", { state: { id: currentUser?.userID } })
        }
      />
      <Button
        title="Logout"
        onClick={onLogout}
      />
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { onLogout } from "../../../api/AuthApi";
// import { useNavigate } from "react-router-dom";
// import { getCurrentUser } from "../../../api/FirestoreAPI";
// import "./index.scss";
// import Button from "../Button";

// export default function ProfilePopup({ closePopup }) {
//   const navigate = useNavigate();
//   const [currentUser, setCurrentUser] = useState({});

//   useEffect(() => {
//     getCurrentUser(setCurrentUser);
//   }, []);

//   const handleViewProfile = () => {
//     navigate("/profile", { state: { id: currentUser?.userID } });
//     closePopup();
//   };

//   const handleLogout = () => {
//     onLogout();
//     closePopup();
//   };

//   return (
//     <div className="popup-card">
//       <Button title="View Profile" onClick={handleViewProfile} />
//       <ul className="popup-options">
//         <li className="popup-option" onClick={handleViewProfile}>
//           Profile
//         </li>
//         <li className="popup-option" onClick={handleLogout}>
//           Logout
//         </li>
//       </ul>
//     </div>
//   );
// }
