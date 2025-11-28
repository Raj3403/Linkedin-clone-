import React, { useMemo, useState } from "react";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import {
  likePost,
  getLikesByUser,
  postComment,
  getComments,
} from "../../../api/FirestoreAPI";
import { getCurrentTimeStamp } from "../../../helpers/useMoment";
import "./index.scss";
import { Timestamp } from "firebase/firestore";


export default function LikeButton({ userId, postId, currentUser }) {
  const [likesCount, setlikesCount] = useState(0);
  const [showCommentBox, setshowCommentBox] = useState(false);
  const [liked, setliked] = useState(false);
  const [Comment, setComment] = useState("");
  const [comments, setcomments] = useState([]);
  const handleLike = () => {
    likePost(userId, postId, liked);
  };
  const getComment = (event) => {
    setComment(event.target.value);
  };

  const addComment = () => {
    postComment(postId, Comment, getCurrentTimeStamp("LLL"), currentUser?.name);
    setComment("");
  };
  useMemo(() => {
    getLikesByUser(userId, postId, setliked, setlikesCount);
    getComments(postId, setcomments);
  }, [userId, postId]);

  return (
    <div className="like-container">
      <p>{likesCount} People like this post </p>
      <div className="hr-line">
        <hr />
      </div>
      <div className="like-comment">
        <div className="likes-comment-inner" onClick={handleLike}>
          {liked ? (
            <AiFillHeart size={30} color="#0a66c2" />
          ) : (
            <AiOutlineHeart size={30} />
          )}
          <p className={liked ? "blue" : "black"}>Like</p>
        </div>

        <div
          className="likes-comment-inner"
          onClick={() => setshowCommentBox(!showCommentBox)}
        >
          <AiOutlineComment
            size={30}
            color={showCommentBox ? "#0a66c2" : "#212121"}
          />

          <p className={showCommentBox ? "blue" : "black"}>Comments</p>
        </div>
      </div>
      {showCommentBox ? (
        <>
          <input
            onChange={getComment}
            placeholder="Add a comment"
            name="Comment"
            className="comment-input"
            value={Comment}
          />
          <button className="add-comment-btn" onClick={addComment}>
            {" "}
            Add Comment{" "}
          </button>
          {comments.length > 0 ? (
            comments.map((comment) => {
              return (
                <div className="all-comments">
                  <p className="name">{comment.name}</p>
                  <p className="comment">{comment.comment}</p>
                  <p className="timestamp">{comment.timeStamp}</p> 
                  {/* <p>●</p>*/}
                </div>
              );
            })
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
