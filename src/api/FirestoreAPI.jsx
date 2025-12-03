import { firestore } from "../firebaseConfig";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

let dbRef = collection(firestore, "posts");
let postsRef = collection(firestore, "posts");
let userRef = collection(firestore, "users");
let likeRef = collection(firestore, "likes");
let commentRef = collection(firestore, "comments");
let connectionRef = collection(firestore , "connections");

export const postStatus = (object) => {
  addDoc(dbRef, object)
    .then(() => {
      toast.success("Post has been added successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getStatus = (setAllStatus) => {
  onSnapshot(dbRef, (response) => {
    setAllStatus(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const getAllUsers = (setAllUsers) => {
  onSnapshot(userRef, (response) => {
    setAllUsers(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const postUserData = (object) => {
  addDoc(userRef, object)
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};
export const getCurrentUser = (setCurrentUser) => {
  const currEmail = localStorage.getItem("userEmail");

  if (!currEmail) {
    console.warn("No userEmail found in localStorage");
    return;
  }

  const userQuery = query(userRef, where("email", "==", currEmail));

  return onSnapshot(userQuery, (response) => {
    if (!response.empty) {
      const userData = response.docs[0].data();
      setCurrentUser({ ...userData, id: response.docs[0].id });
    } else {
      setCurrentUser(null);
      console.warn("User not found in Firestore");
    }
  });
};

export const editProfile = (userID, payLoad) => {
  let userToEdit = doc(userRef, userID);

  updateDoc(userToEdit, payLoad)
    .then(() => {
      toast.success("Profile has been updated successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getSingleStatus = (setAllStatus, email) => {
  const singlePostQuery = query(postsRef, where("userEmail", "==", email));

  onSnapshot(singlePostQuery, (response) => {
    setAllStatus(
      response.docs.map((docs) => {
        // console.log("data", docs.data());
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const getSingleUser = (setCurrentUser, email) => {
  const singleUserQuery = query(userRef, where("email", "==", email));
  onSnapshot(singleUserQuery, (response) => {
    setCurrentUser(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })[0]
    );
  });
};

export const likePost = async (userId, postId, liked) => {
  console.log("likePost called with:", { userId, postId });

  try {
    const docToLike = doc(likeRef, `${userId}_${postId}`);
    if (liked) {
      deleteDoc(docToLike);
    } else {
      await setDoc(docToLike, {
        userId,
        postId,
        likedAt: new Date().toISOString(),
      });
    }
    console.log("like saved:", `${userId}_${postId}`);
  } catch (err) {
    console.error("Error saving like:", err);
  }
};

export const getLikesByUser = (userId, postId, setliked, setlikesCount) => {
  try {
    let likeQuery = query(likeRef, where("postId", "==", postId));
    onSnapshot(likeQuery, (response) => {
      let likes = response.docs.map((doc) => doc.data());
      let likesCount = likes.length;

      const isLiked = likes.some((like) => like.userId === userId);
      setlikesCount(likesCount);
      setliked(isLiked);
    });
  } catch (err) {
    console.log(err);
  }
};

export const postComment = (postId, comment, timeStamp, name) => {
  try {
    addDoc(commentRef, {
      postId,
      comment,
      timeStamp,
      name,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getComments = (postId, setcomments) => {
  try {
    let SinglePostQuery = query(commentRef, where("postId", "==", postId));
    onSnapshot(SinglePostQuery, (response) => {
      const comments = response.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      setcomments(comments);
    });
  } catch (err) {
    console.log(err);
  }
};

export const updatePost = (id, status , postImage) => {
  let docToUpdate = doc(postsRef, id);

  try {
    updateDoc(docToUpdate, { status , postImage});
    toast.success("Post has been Updated!");
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = (id) => {
  let docToDelete = doc(postsRef, id);
  try {
    deleteDoc(docToDelete);
    toast.success("Post has been Deleted!");
  } catch (err) {
    console.log(err);
  }
};

export const addConnection = async (userId, targetId) => {
  console.log("likePost called with:", { userId, targetId });

  try {
    let connectionToAdd = doc(connectionRef, `${userId}_${targetId}`);
    setDoc(connectionToAdd, {
      userId,
      targetId,
    });
        toast.success("Connection Added!");

  } catch (err) {
    console.log(err);
  }
};



export const getConnections = (userId, targetId , setIsConnected) => {
  try {
    let connectionsQuery = query(connectionRef, where("targetId", "==", targetId));
    onSnapshot(connectionsQuery, (response) => {
      let connections = response.docs.map((doc) => doc.data());

      const isConnected = connections.some((connection) => connection.userId === userId);
      setIsConnected(isConnected);

    });
  } catch (err) {
    console.log(err);
  }
};