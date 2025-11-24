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
} from "firebase/firestore";
import { toast } from "react-toastify";

let dbRef = collection(firestore, "posts");
let postsRef = collection(firestore, "posts");
let userRef = collection(firestore, "users");
let likeRef = collection(firestore, "likes");

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

export const postUserData = (object) => {
  addDoc(userRef, object)
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};

// export const getCurrentUser = (setCurrentUser) => {
//   let currEmail = localStorage.getItem("userEmail");

//   onSnapshot(userRef, (response) => {
//     setCurrentUser(
//       response.docs
//         .map((docs) => {
//           return { ...docs.data(), id: docs.id };
//         })
//         .filter((item) => {
//           return item.email === localStorage.getItem("userEmail");
//         })[0]
//     );
//   });
// };


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

        console.log("data" , docs.data())
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



export const likePost = async (userId, postId) => {
  console.log("likePost called with:", { userId, postId });

  try {
    const docToLike = doc(likeRef, `${userId}_${postId}`);
    await setDoc(docToLike, { userId, postId, likedAt: new Date().toISOString() });
    console.log("like saved:", `${userId}_${postId}`);
  } catch (err) {
    console.error("Error saving like:", err);
  }
};
