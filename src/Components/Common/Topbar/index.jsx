import "../Topbar/index.scss";
import linkedinLogo from "../../../assets/linkedinLogo.png";
import {
  AiOutlineHome,
  AiOutlineUserSwitch,
  AiOutlineSearch,
  AiOutlineMessage,
  AiOutlineBell,
} from "react-icons/ai";
import { BsBriefcase } from "react-icons/bs";
import user from "../../../assets/user.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfilePopup from "../ProfilePopup";

export default function Topbar() {
  let Navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
const goToRoute = (route, options) => {
  Navigate(route, options);
};

  return (
    <div className="topbar-main">
      <img className="linkedin-logo" src={linkedinLogo} alt="linkedinLogo" />
      <div className="react-icons">
        <AiOutlineSearch size={30} className="react-icon" />
        <AiOutlineHome
          size={30}
          className="react-icon"
          onClick={() => goToRoute("/home")}
        />
        <AiOutlineUserSwitch
          size={30}
          className="react-icon"
          onClick={() => goToRoute("/profile" , {
            state:{
              email:localStorage.getItem("userEmail") ,
              id:localStorage.getItem("uid")
            }
          })}
        />
        <BsBriefcase size={30} className="react-icon" />
        <AiOutlineMessage size={30} className="react-icon" />
        <AiOutlineBell size={30} className="react-icon" />
      </div>
        <img
          className="user-logo"
          src={user}
          alt="user"
          onClick={() => setShowPopup(!showPopup)}
        />
        {showPopup && <ProfilePopup/>}
    </div>
  );
}

// import "../Topbar/index.scss";
// import linkedinLogo from "../../../assets/linkedinLogo.png";
// import {
//   AiOutlineHome,
//   AiOutlineUserSwitch,
//   AiOutlineSearch,
//   AiOutlineMessage,
//   AiOutlineBell,
// } from "react-icons/ai";
// import { BsBriefcase } from "react-icons/bs";
// import user from "../../../assets/user.png";
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import ProfilePopup from "../ProfilePopup";

// export default function Topbar() {
//   const navigate = useNavigate();
//   const [showPopup, setShowPopup] = useState(false);

//   const goToRoute = (route) => navigate(route);

//   // Close popup when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(".user-section")) {
//         setShowPopup(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   return (
//     <div className="topbar-main">
//       <img className="linkedin-logo" src={linkedinLogo} alt="linkedinLogo" />
//       <div className="react-icons">
//         <AiOutlineSearch size={30} className="react-icon" />
//         <AiOutlineHome
//           size={30}
//           className="react-icon"
//           onClick={() => goToRoute("/home")}
//         />
//         <AiOutlineUserSwitch
//           size={30}
//           className="react-icon"
//           onClick={() => goToRoute("/profile")}
//         />
//         <BsBriefcase size={30} className="react-icon" />
//         <AiOutlineMessage size={30} className="react-icon" />
//         <AiOutlineBell size={30} className="react-icon" />
//       </div>

//       <div className="user-section" style={{ position: "relative" }}>
//         <img
//           className="user-logo"
//           src={user}
//           alt="user"
//           onClick={(e) => {
//             e.stopPropagation(); // prevent outside click from closing immediately
//             setShowPopup(!showPopup);
//           }}
//         />
//         {showPopup && (
//           <div className="popup-position">
//             <ProfilePopup closePopup={() => setShowPopup(false)} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
