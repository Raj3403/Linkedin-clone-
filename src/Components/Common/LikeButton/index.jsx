import React from "react";
import { AiOutlineLike } from "react-icons/ai";
import { likePost } from "../../../api/FirestoreAPI";
import "./index.scss";

export default function LikeButton({ userId  , postId}) {
    const handleLike = () =>{
        likePost(userId , postId)
    }

  return (
    <div className="like-container" onClick={handleLike}>
      <AiOutlineLike size={30} />
      <p>Like</p>
    </div>
  );
}
