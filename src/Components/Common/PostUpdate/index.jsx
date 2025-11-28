import React, { useState, useEffect } from "react";
import ModalComponent from "../Modal";
import { postStatus, getStatus , updatePost } from "../../../api/FirestoreAPI";
import PostsCard from "../PostsCard";
import { getCurrentTimeStamp } from "../../../helpers/useMoment";
import { getUniqueId } from "../../../helpers/getUniqueId";
import "./index.scss";

export default function PostStatus({ currentUser = {} }) {
  const userEmailFromStorage = localStorage.getItem("userEmail") || "";
  const userNameFromStorage = localStorage.getItem("userName") || "";
  const [modalOpen, setModalOpen] = useState(false);
  const [status, SetStatus] = useState("");
  const [currentPost , setCurrentPost] = useState({});
  const [allStatuses, setAllStatus] = useState([]);
  const userEmail = userEmailFromStorage || currentUser?.email || "";
  const userName =
    currentUser?.name ||
    currentUser?.displayName ||
    userNameFromStorage ||
    "Unknown User";
  const [isEdit, setIsEdit] = useState(false);

  const sendStatus = async () => {
    if (!status || status.trim() === "") {
      console.warn("Cannot post empty status");
      return;
    }

    // create an object with a consistent `id` and also keep `postID` if backend uses that
    const id = getUniqueId();
    const object = {
      id, // consistent id field
      postID: id, // keep this if other code expects postID
      status: status.trim(),
      timeStamp: getCurrentTimeStamp("LLL"),
      userEmail: userEmail,
      userName: userName,
      userID: currentUser?.id || currentUser?.userID || null,
    };

    try {
      await postStatus(object);
      SetStatus("");
      setModalOpen(false);
      setIsEdit(false);
      // re-fetch statuses (or optimistically add)
      getStatus(setAllStatus);

    } catch (err) {
      console.error("Failed to post status:", err);
    }
  };

  const getEditData = (posts) => {
    setModalOpen(true);
    SetStatus(posts?.status);
    setCurrentPost(posts);
    setIsEdit(true);
  };

  const updateStatus = () =>{
    console.log(status);
    setModalOpen(false);
    updatePost(currentPost.id , status);
    setModalOpen(false);
  }

  useEffect(() => {
    // subscribe or fetch statuses
    getStatus(setAllStatus);
    // if getStatus returns an unsubscribe, return it
  }, []);


  return (
    <div className="post-status-main">
      <div className="user-details">
        <img  src={currentUser.imageLink} alt="imageLink" />
        <p className="name">{currentUser.name}</p>
        <p className="headline">{currentUser.headline}</p>
      </div>
      <div className="post-status">
                <img className="post-image" src={currentUser.imageLink} alt="imageLink" />

        <button
          className="open-post-modal"
          onClick={() => {
            setModalOpen(true);
            setIsEdit(false);
          }}
        >
          Start a Post
        </button>
      </div>

      <ModalComponent
        SetStatus={SetStatus}
        status={status}
        sendStatus={sendStatus}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        isEdit={isEdit}
        updateStatus={updateStatus}
      />

      <div>
        {allStatuses.map((posts) => {
          const keyId =
            posts.postID || posts.id || posts._id || posts.documentId;
          return (
            <PostsCard
              key={keyId || getUniqueId()}
              posts={posts}
              getEditData={getEditData}
            />
          );
        })}
      </div>
    </div>
  );
}
