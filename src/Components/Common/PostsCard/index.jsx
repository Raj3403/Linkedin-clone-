// import React, { useEffect, useState } from "react";
// import LikeButton from "../LikeButton";
// import { useNavigate } from "react-router-dom";
// import { getCurrentUser } from "../../../api/FirestoreAPI";
// import "./index.scss";

// function PostsCard({ posts, id }) {
//   let navigate = useNavigate();
//   const [currentUser, setCurrentUser] = useState({});

//   useEffect(() => {
//     getCurrentUser(setCurrentUser);
//   }, []);

//   return (
//     <div className="posts-card" key={id}>
//       <p
//         className="name"
//         onClick={() =>
//           navigate("/profile", {
//             state: { id: posts?.userID, email: posts?.userEmail },
//           })
//         }
//       >
//         {posts.userName}
//       </p>
//       <p className="timestamp">{posts.timeStamp}</p>
//       <p className="status">{posts.status}</p>
//       <LikeButton userId={currentUser?.id} postId={posts.id}/>
//         {/* <LikeButton userId={currentUser?.userId} postId={posts.id} /> */}
//     </div>
//   );
// }

// export default PostsCard;

// PostsCard.jsx
import React, { useEffect, useState } from "react";
import LikeButton from "../LikeButton";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../../api/FirestoreAPI";
import "./index.scss";

function PostsCard({ posts, id }) {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    getCurrentUser(setCurrentUser);
  }, []);

  const handleOpenProfile = () => {
    // save to localStorage so profile page still knows which user to show after refresh
    const email = posts?.userEmail || posts?.email || "";
    if (email) localStorage.setItem("profileEmail", email);


    console.log("text" , posts.userID , posts)

    // also pass in location state for immediate navigation
    navigate("/profile", {
      state: { id: posts?.userID || posts?.userId, email },
    });
  };

  return (
    <div className="posts-card" key={id}>
      <p className="name" onClick={handleOpenProfile}>
        {posts.userName}
      </p>
      <p className="timestamp">{posts.timeStamp}</p>
      <p className="status">{posts.status}</p>

      <LikeButton userId={currentUser?.id} postId={posts.postID || posts.id || posts.postID} />
    </div>
  );
}

export default PostsCard;
