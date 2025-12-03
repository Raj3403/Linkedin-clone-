import React, { useState, useEffect } from "react";
import ModalComponent from "../Modal";
import { postStatus, getStatus, updatePost } from "../../../api/FirestoreAPI";
import PostsCard from "../PostsCard";
import { UploadPostImage } from "../../../api/ImageUpload";
import { getCurrentTimeStamp } from "../../../helpers/useMoment";
import { getUniqueId } from "../../../helpers/getUniqueId";
import "./index.scss";

export default function PostStatus({ currentUser = {} }) {
  const userEmailFromStorage = localStorage.getItem("userEmail") || "";
  const userNameFromStorage = localStorage.getItem("userName") || "";
  const [modalOpen, setModalOpen] = useState(false);
  const [status, SetStatus] = useState("");
  const [currentPost, setCurrentPost] = useState({});
  const [allStatuses, setAllStatus] = useState([]);
  const [postImage, setPostImage] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const userEmail = userEmailFromStorage || currentUser?.email || "";
  const userName =
    currentUser?.name ||
    currentUser?.displayName ||
    userNameFromStorage ||
    "Unknown User";

  // Fetch statuses
  useEffect(() => {
    getStatus(setAllStatus);
  }, []);

  // Start a fresh post: clear previous edit values
  const openCreateModal = () => {
    SetStatus("");
    setPostImage("");
    setCurrentPost({});
    setIsEdit(false);
    setModalOpen(true);
  };

  // Prepare modal for edit and populate fields
  const getEditData = (post) => {
    setCurrentPost(post || {});
    SetStatus(post?.status || "");
    setPostImage(post?.postImage || "");
    setIsEdit(true);
    setModalOpen(true);
  };

  const sendStatus = async () => {
    if (!status || status.trim() === "") {
      console.warn("Cannot post empty status");
      return;
    }

    const id = getUniqueId();
    const object = {
      id,
      postID: id,
      status: status.trim(),
      timeStamp: getCurrentTimeStamp("LLL"),
      userEmail: userEmail,
      userName: userName,
      userID: currentUser?.id || currentUser?.userID || null,
      postImage: postImage || "",
    };

    try {
      await postStatus(object);
      // clear local state after successful post
      SetStatus("");
      setPostImage("");
      setCurrentPost({});
      setIsEdit(false);
      setModalOpen(false);

      // refresh statuses
      getStatus(setAllStatus);
    } catch (err) {
      console.error("Failed to post status:", err);
    }
  };

  const updateStatusHandler = async () => {
    if (!currentPost?.id) {
      console.warn("No post selected for update");
      return;
    }

    try {
      // wait for update to finish
      await updatePost(currentPost.id, status, postImage || "");

      // clear states after update
      SetStatus("");
      setPostImage("");
      setCurrentPost({});
      setIsEdit(false);
      setModalOpen(false);

      // refresh statuses
      getStatus(setAllStatus);
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };

  return (
    <div className="post-status-main">
      <div className="user-details">
        <img src={currentUser.imageLink} alt="imageLink" />
        <p className="name">{currentUser.name}</p>
        <p className="headline">{currentUser.headline}</p>
      </div>

      <div className="post-status">
        <img className="post-image" src={currentUser.imageLink} alt="imageLink" />

        <button
          className="open-post-modal"
          onClick={openCreateModal}
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
        updateStatus={updateStatusHandler}
        imageUrl={isEdit ? (currentPost?.postImage || "") : postImage || ""}
        UploadPostImage={UploadPostImage}
        setPostImage={setPostImage}
        currentPost={currentPost}
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
