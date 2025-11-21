
// import React, { useState, useEffect } from "react";
// import ModalComponent from "../Modal";
// import { postStatus, getStatus } from "../../../api/FirestoreAPI";
// import PostsCard from "../PostsCard";
// import { getCurrentTimeStamp } from "../../../helpers/useMoment";
// import { getUniqueId } from "../../../helpers/getUniqueId";
// import "./index.scss";

// export default function PostStatus({ currentUser = {} }) {
//   const userEmailFromStorage = localStorage.getItem("userEmail") || "";
//   const userNameFromStorage = localStorage.getItem("userName") || "";
//   const [modalOpen, setModalOpen] = useState(false);
//   const [status, SetStatus] = useState("");
//   const [allStatuses, setAllStatus] = useState([]);
//   const userEmail = userEmailFromStorage || currentUser.email || "";
//   const userName = currentUser.name || currentUser.displayName || userNameFromStorage || "Unknown User";

//   const sendStatus = async () => {
//     // validate before send
//     if (!status || status.trim() === "") {
//       // you can show toast/error message here
//       console.warn("Cannot post empty status");
//       return;
//     }

//     const object = {
//       status: status.trim(),
//       timeStamp: getCurrentTimeStamp("LLL"),
//       userEmail: currentUser.email,
//       userName: currentUser.name,
//       postID: getUniqueId(),
//     };

//     try {
//       await postStatus(object); // assume this returns a Promise
//       SetStatus(""); // clear input (use empty string, not undefined)
//       setModalOpen(false);
//       // Option A: Re-fetch statuses to reflect new post:
//       getStatus(setAllStatus);
//       // Option B: or optimistically add to state:
//       // setAllStatus(prev => [{ ...object }, ...prev]);
//     } catch (err) {
//       console.error("Failed to post status:", err);
//       // show toast or UI error
//     }
//   };

//   useEffect(() => {
//     // subscribe / fetch statuses
//     // getStatus should call setAllStatus or return values
//     getStatus(setAllStatus);
//     // if getStatus returns unsubscribe function, return it here.
//   }, []);

//   return (
//     <div className="post-status-main">
//       <div className="post-status">
//         <button className="open-post-modal" onClick={() => setModalOpen(true)}>
//           Start a Post
//         </button>
//       </div>

//       <ModalComponent
//         SetStatus={SetStatus}
//         status={status}
//         sendStatus={sendStatus}
//         modalOpen={modalOpen}
//         setModalOpen={setModalOpen}
//       />

//       <div>
//         {allStatuses.map((posts) => {
//           const keyId = posts.postID || posts.id || posts._id || posts.documentId;
//           return <PostsCard key={keyId || getUniqueId()} posts={posts} />;
//         })}
//       </div>
//     </div>
//   );
// }



// import React, { useState, useMemo } from "react";
// import ModalComponent from "../Modal";
// import { postStatus, getStatus  } from "../../../api/FirestoreAPI";
// import PostsCard from "../PostsCard";
// import { getCurrentTimeStamp } from "../../../helpers/useMoment";
// import { getUniqueId } from "../../../helpers/getUniqueId";
// import "./index.scss";

// export default function PostStatus({ currentUser = {} }) {
//   let userEmail = localStorage.getItem("userEmail");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [status, SetStatus] = useState("");
//   const [allStatuses, setAllStatus] = useState([]);

//   const sendStatus = async () => {
//     const object = {
//       status: status,
//       timeStamp: getCurrentTimeStamp("LLL"),
//       userEmail: userEmail,
//       userName: currentUser.name,
//       postID: getUniqueId(),
//     };
//     // console.log("object");
//     await postStatus(object);
//     await setModalOpen(false);
//     await getStatus(setAllStatus);
    
//   }   

//   useMemo(() => {
//     getStatus(setAllStatus);
//   }, []);

//   return (
//     <div className="post-status-main">
//       <div className="post-status">
//         <button className="open-post-modal" onClick={() => setModalOpen(true)}>
//           Start a Post
//         </button>
//       </div>
//       <ModalComponent
//         SetStatus={SetStatus}
//         status={status}
//         sendStatus={sendStatus}
//         modalOpen={modalOpen}
//         setModalOpen={setModalOpen}
//       />

//       <div>
//         {allStatuses.map((posts) => (
//           <PostsCard key={posts.id} posts={posts} />
//         ))}
//       </div>
//     </div>
//   );
// }





// PostStatus.jsx
import React, { useState, useEffect } from "react";
import ModalComponent from "../Modal";
import { postStatus, getStatus } from "../../../api/FirestoreAPI";
import PostsCard from "../PostsCard";
import { getCurrentTimeStamp } from "../../../helpers/useMoment";
import { getUniqueId } from "../../../helpers/getUniqueId";
import "./index.scss";

export default function PostStatus({ currentUser = {} }) {
  const userEmailFromStorage = localStorage.getItem("userEmail") || "";
  const userNameFromStorage = localStorage.getItem("userName") || "";
  const [modalOpen, setModalOpen] = useState(false);
  const [status, SetStatus] = useState("");
  const [allStatuses, setAllStatus] = useState([]);
  const userEmail = userEmailFromStorage || currentUser.email || "";
  const userName = currentUser.name || currentUser.displayName || userNameFromStorage || "Unknown User";

  const sendStatus = async () => {
    if (!status || status.trim() === "") {
      console.warn("Cannot post empty status");
      return;
    }

    // create an object with a consistent `id` and also keep `postID` if backend uses that
    const id = getUniqueId();
    const object = {
      id,                 // consistent id field
      postID: id,         // keep this if other code expects postID
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
      // re-fetch statuses (or optimistically add)
      getStatus(setAllStatus);
    } catch (err) {
      console.error("Failed to post status:", err);
    }
  };

  useEffect(() => {
    // subscribe or fetch statuses
    getStatus(setAllStatus);
    // if getStatus returns an unsubscribe, return it
  }, []);

  return (
    <div className="post-status-main">
      <div className="post-status">
        <button className="open-post-modal" onClick={() => setModalOpen(true)}>
          Start a Post
        </button>
      </div>

      <ModalComponent
        SetStatus={SetStatus}
        status={status}
        sendStatus={sendStatus}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />

      <div>
        {allStatuses.map((posts) => {
          const keyId = posts.postID || posts.id || posts._id || posts.documentId;
          return <PostsCard key={keyId || getUniqueId()} posts={posts} />;
        })}
      </div>
    </div>
  );
}
