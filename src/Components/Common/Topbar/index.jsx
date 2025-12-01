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
import { useEffect, useState } from "react";
import SearchUsers from "../SearchUsers";
import { getAllUsers } from "../../../api/FirestoreAPI";
import ProfilePopup from "../ProfilePopup";

export default function Topbar() {
  let Navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const goToRoute = (route, options) => {
    Navigate(route, options);
  };

  const handleSearch = () => {
    if (searchInput !== "") {
      let searched = users.filter((user) => {
        return Object.values(user)
          .join("")
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });
      setFilteredUsers(searched);
    } else {
      setFilteredUsers(users);
    }
  };

  useEffect(() => {
    let debounced = setTimeout(() => {
      handleSearch();
    }, 1000);
    return () => clearTimeout(debounced);
  }, [searchInput]);

  useEffect(() => {
    getAllUsers(setUsers);
  }, []);

  return (
    <div className="topbar-main">
      <img className="linkedin-logo" src={linkedinLogo} alt="linkedinLogo" />

      {isSearch ? (
        <SearchUsers
          setIsSearch={setIsSearch}
          setSearchInput={setSearchInput}
        />
      ) : (
        <div className="react-icons">
          <AiOutlineSearch
            size={30}
            className="react-icon"
            onClick={() => setIsSearch(true)}
          />
          <AiOutlineHome
            size={30}
            className="react-icon"
            onClick={() => goToRoute("/home")}
          />
          <AiOutlineUserSwitch
            size={30}
            className="react-icon"
            onClick={() =>
              goToRoute("/Connections", {
                state: {
                  email: localStorage.getItem("userEmail"),
                  id: localStorage.getItem("uid"),
                },
              })
            }
          />
          <BsBriefcase size={30} className="react-icon" />
          <AiOutlineMessage size={30} className="react-icon" />
          <AiOutlineBell size={30} className="react-icon" />
        </div>
      )}

      <img
        className="user-logo"
        src={user}
        alt="user"
        onClick={() => setShowPopup(!showPopup)}
      />
      {showPopup && <ProfilePopup />}

      {searchInput.length === 0 ? (
        <></>
      ) : (
        <div className="search-results">
          {filteredUsers.length === 0 ? (
            <div className="search-inner">No Results Found..</div>
          ) : (
            filteredUsers.map((user) => (
              <div className="search-inner">
                <img src={user.imageLink} />
                <p className="name">{user.name}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
