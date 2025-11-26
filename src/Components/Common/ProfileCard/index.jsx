import React, { useState, useEffect } from "react";
import {
  getSingleStatus,
  getSingleUser,
} from "../../../api/FirestoreAPI"; 
import { HiOutlinePencil } from "react-icons/hi";
import "./index.scss";
import PostsCard from "../PostsCard";
import { useLocation } from "react-router-dom";
import { getUniqueId } from "../../../helpers/getUniqueId";
import { UploadImage as uploadImageApi } from "../../../api/ImageUpload";

export default function ProfileCard({ onEdit, currentUser }) {
  const location = useLocation();
  // Normalize safely so no field becomes undefined
  const normalizeProfile = (user = {}) => ({
    name: user?.name || "",
    headline: user?.headline || "",
    country: user?.country || "",
    city: user?.city || "",
    company: user?.company || "",
    industry: user?.industry || "",
    college: user?.college || "",
    website: user?.website || "",
    aboutMe: user?.aboutMe || "",
    skills: user?.skills || "",
    id: user?.id || "",
    email: user?.email || "",
    userID: user?.userID || "",
  });

  const [allStatuses, setAllStatus] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(
    normalizeProfile(currentUser)
  );
  const [currentImage, setcurrentImage] = useState({});
  // const [ImageLink, setImageLink] = useState("");
  // const[modalopen , setmodalopen] = useState(false);

  const getImage = (event) => {
    setcurrentImage(event.target.files[0]);
  };


  const uploadImage = () => {
    uploadImageApi(currentImage, currentUser.id);
  };

  useEffect(() => {
    if (!location?.state?.email) return;

    const email = location.state.email;

    // Fetch posts
    getSingleStatus(setAllStatus, email);

    // Fetch profile
    getSingleUser((res) => {
      setCurrentProfile(normalizeProfile(res));
    }, email);
  });

  // ❌ This caused "updateDoc() called with invalid data (undefined)" because
  // you were calling editProfile with only the id and no data object.
  // ProfileCard should not update Firestore automatically like this.
  //
  // useEffect(() => {
  //   if (currentUser?.id) {
  //     editProfile(currentUser.id);
  //   }
  // }, [currentUser]);

  return (
    <>
      <div className="profile-card">
        <input type={"file"} onChange={getImage} />
        <button onClick={uploadImage}>Upload</button>
        <div className="edit-btn">
          <HiOutlinePencil className="edit-icon" onClick={onEdit} />
        </div>

        <div className="profile-info">
          <div> 
            <img className="profile-image" src={currentUser?.imageLink} alt="profile-image" />
            {/* NAME */}
            <h3 className="userName">{currentProfile.name}</h3>

            {/* HEADLINE */}
            <p className="heading">{currentProfile.headline}</p>

            {/* LOCATION */}
            <p className="location">
              {currentProfile.city}{" "}
              {currentProfile.city && currentProfile.country && ", "}
              {currentProfile.country}
            </p>

            {/* WEBSITE */}
            <a
              className="website"
              target="_blank"
              rel="noopener noreferrer"
              href={currentProfile.website || ""}
            >
              {currentProfile.website}
            </a>
          </div>

          {/* RIGHT SIDE INFO */}
          <div className="right-info">
            <p className="college">{currentProfile.college}</p>
            <p className="company">{currentProfile.company}</p>
          </div>
        </div>

        {/* ABOUT ME */}
        <p className="about-me">{currentProfile.aboutMe}</p>

        {/* SKILLS */}
        <p className="skills">
          <span className="skill-label">Skills</span>: {currentProfile.skills}
        </p>
      </div>

      {/* USER POSTS */}
      <div className="post-status-main">
        {allStatuses.map((posts) => {
          const keyId =
            posts.postID || posts.id || posts._id || posts.documentId;
          return <PostsCard key={keyId || getUniqueId()} posts={posts} />;
        })}
      </div>
    </>
  );
}
