import React, { useMemo, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { likePost , getLikesByUser } from "../../../api/FirestoreAPI";
import "./index.scss";

export default function LikeButton({ userId  , postId}) {
  const [likesCount , setlikesCount] = useState(0);
  const [liked , setliked] = useState(false);
    const handleLike = () =>{
        likePost(userId , postId )
    }

  useMemo(() => {
getLikesByUser(userId, postId , setliked , setlikesCount)
  },[userId  , postId])
  
  return (
    <div className="like-container" onClick={handleLike}>
      <AiOutlineLike size={30} />
      <p>Like</p>
      {likesCount}
    </div>
  );
}
