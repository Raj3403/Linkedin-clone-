import React, { useEffect, useState } from "react";
import LikeButton from "../LikeButton";
import { useNavigate } from "react-router-dom";
import { BsPencil, BsTrash } from "react-icons/bs";
import {
  getCurrentUser,
  getAllUsers,
  deletePost,
} from "../../../api/FirestoreAPI";
import "./index.scss";

function PostsCard({ posts, id, getEditData }) {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    getCurrentUser(setCurrentUser);
    getAllUsers(setAllUsers);
  }, []);

  const handleOpenProfile = () => {
    const email = posts?.userEmail || posts?.email || "";
    if (email) localStorage.setItem("profileEmail", email);

    navigate("/profile", {
      state: { id: posts?.userID || posts?.userId, email },
    });
  };

  // console.log(currentUser.id);
  // console.log(posts.userID);
  return (
    <div className="posts-card" key={id}>
      <div className="post-image-wrapper">
        {currentUser.id === posts.userID ? (
          <div className="action-container">
            <BsPencil
              size={20}
              className="action-icon"
              onClick={() => getEditData(posts)}
            />
            <BsTrash
              size={20}
              className="action-icon"
              onClick={() => deletePost(posts.id)}
            />
          </div>
        ) : (
          <></>
        )}
        <img
          className="post-image"
          alt="profile-image"
          src={
            allUsers
              .filter((item) => item.id === posts.userID)
              .map((item) => item.imageLink)[0] ||
            "https://via.placeholder.com/150"
          }
        />
        <div>
          <p className="name" onClick={handleOpenProfile}>
            {allUsers.filter((user) => user.id === posts.userID)[0]?.name}
          </p>
          <p className="headline">
            {allUsers.filter((user) => user.id === posts.userID)[0]?.headline}
          </p>

          <p className="timestamp">{posts.timeStamp}</p>
        </div>
      </div>

      <p className="status">{posts.status}</p>

      <LikeButton
        userId={currentUser?.id}
        postId={posts.postID || posts.id || posts.postID}
        currentUser={currentUser}
      />
    </div>
  );
}

export default PostsCard;
