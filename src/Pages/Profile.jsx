// import React, { useEffect , useState} from "react";
// import ProfileComponent from "../Components/ProfileComponent";
// import { onAuthStateChanged } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../firebaseConfig";
// import Loader from "../Components/Common/Loader/Loader";

// function Profile({currentUser}) {
//     const [loading , setLoading] = useState(true);
//     let Navigate = useNavigate();
//       useEffect(() => {
//         onAuthStateChanged(auth, (res) => {
//           if (!res?.accessToken) {
//             Navigate("/");
//           } else {
//             setLoading(false);
//           }
//         });
//       }, []);
//   return loading ? <Loader/> : <ProfileComponent currentUser={currentUser}/>;
// }

// export default Profile;


// Profile.jsx
import React, { useEffect, useState } from "react";
import ProfileComponent from "../Components/ProfileComponent"; 
import PostsCard from "../Components/Common/PostsCard";
import Loader from "../Components/Common/Loader/Loader";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getStatus, getSingleUser } from "../api/FirestoreAPI"; 
export default function Profile({ currentUser }) {
  const [loading, setLoading] = useState(true);
  const [allStatuses, setAllStatuses] = useState([]);
  const [profileEmail, setProfileEmail] = useState("");
  const [profileUser, setProfileUser] = useState(null); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (res) => {
      if (!res?.accessToken) {
        navigate("/");
      } else {
        setLoading(false);
      }
    });

    // cleanup
    return () => unsubAuth && unsubAuth();
  }, [navigate]);

  useEffect(() => {
    const emailFromState = location?.state?.email;
    const saved = localStorage.getItem("profileEmail") || "";

    if (emailFromState) {
      setProfileEmail(emailFromState);
      localStorage.setItem("profileEmail", emailFromState);
    } else if (saved) {
      setProfileEmail(saved);
    } else {
      const userEmailFromStorage = localStorage.getItem("userEmail") || currentUser?.email;
      if (userEmailFromStorage) {
        setProfileEmail(userEmailFromStorage);
      } else {
        setProfileEmail("");
      }
    }
  }, [location?.state?.email, currentUser]);

  useEffect(() => {
    const maybeUnsub = getStatus((data) => {
      setAllStatuses(data || []);
    });

    return typeof maybeUnsub === "function" ? maybeUnsub : undefined;
  }, []);

  useEffect(() => {
    if (!profileEmail) return;

    if (typeof getSingleUser === "function") {
      try {
        const maybeUnsubOrPromise = getSingleUser(profileEmail, (userDoc) => {
          setProfileUser(userDoc || null);
        });

        if (typeof maybeUnsubOrPromise === "function") {
          return () => maybeUnsubOrPromise();
        }
        if (maybeUnsubOrPromise && typeof maybeUnsubOrPromise.then === "function") {
          maybeUnsubOrPromise
            .then((resp) => {
              if (resp) setProfileUser(resp);
            })
            .catch((err) => {
              console.error("getSingleUser error:", err);
            });
        }
      } catch (err) {
        console.warn("getSingleUser not compatible or threw error:", err);
      }
    }
  }, [profileEmail]);

  const profilePosts = allStatuses.filter((p) => {
    const email = p?.userEmail || p?.email || "";
    return email && profileEmail && email === profileEmail;
  });

  useEffect(() => {
    if (!profileUser && profilePosts.length > 0) {
      const sample = profilePosts[0];
      setProfileUser((prev) => prev || {
        name: sample.userName || sample.name || "Unknown",
        email: profileEmail,
        id: sample.userID || sample.userId || null,
      });
    }
  }, [profilePosts, profileEmail, profileUser]);

  if (loading) return <Loader />;

  return (
    <div className="profile-page">
      <div className="profile-card-section">
        <ProfileComponent currentUser={profileUser} />
      </div>

      <div className="profile-posts-section">
        {/* <h3 style={{ marginTop: 16 }}>{profileUser?.name || profileEmail}'s posts</h3> */}

        {profilePosts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          profilePosts.map((posts) => {
            const keyId = posts.postID || posts.id || posts._id || posts.documentId;
            return <PostsCard key={keyId} posts={posts} />;
          })
        )}
      </div>
    </div>
  );
}
