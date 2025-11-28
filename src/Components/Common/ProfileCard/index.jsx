import React, { useState, useEffect } from "react";
import { getSingleStatus, getSingleUser } from "../../../api/FirestoreAPI";
import { HiOutlinePencil } from "react-icons/hi";
import "./index.scss";
import PostsCard from "../PostsCard";
import { useLocation } from "react-router-dom";
import { getUniqueId } from "../../../helpers/getUniqueId";
import { UploadImage as uploadImageApi } from "../../../api/ImageUpload";
import FileUploadModal from "../FileUploadModal";

export default function ProfileCard({ onEdit, currentUser }) {
  const location = useLocation();

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
    imageLink: user?.imageLink || "",
  });

  const [allStatuses, setAllStatus] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(
    normalizeProfile(currentUser)
  );
  const [currentImage, setCurrentImage] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const getImage = (event) => {
    const file = event.target.files[0];
    setCurrentImage(file || {});
    setProgress(0);
  };

  const uploadImage = () => {
    console.log("uploadImage clicked:", {
      currentImage,
      currentProfile,
      currentUser,
    });

    if (!currentImage || !currentImage.name) {
      console.error("uploadImage: no file selected");
      return;
    }

    const profileId =
      currentProfile?.id ||
      currentUser?.id ||
      currentProfile?.userID ||
      currentUser?.userID;

    if (!profileId) {
      console.error("uploadImage: no profile id found", {
        currentProfile,
        currentUser,
      });
      return;
    }

    // start smooth fake progress
    setProgress(0);
    let fakeInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(fakeInterval);
          return 90;
        }
        return prev + 5;
      });
    }, 200);

    uploadImageApi(currentImage, profileId)
      .then((url) => {
        clearInterval(fakeInterval);
        setProgress(100);

        setCurrentProfile((prev) => ({
          ...prev,
          imageLink: url,
        }));

        setCurrentImage({});
        // close modal after a short delay so user can see 100%
        setTimeout(() => {
          setModalOpen(false);
          setProgress(0);
        }, 500);
      })
      .catch((err) => {
        clearInterval(fakeInterval);
        console.error("Upload failed:", err);
        setProgress(0);
      });
  };

  useEffect(() => {
    const email = location?.state?.email;
    if (!email) return;

    // Posts
    getSingleStatus(setAllStatus, email);

    // Profile
    getSingleUser((res) => {
      setCurrentProfile(normalizeProfile(res));
    }, email);
  }, [location?.state?.email]);

  return (
    <>
      <FileUploadModal
        getImage={getImage}
        uploadImage={uploadImage}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        currentImage={currentImage}
        progress={progress}
      />

      <div className="profile-card">
        <div className="edit-btn">
          <HiOutlinePencil className="edit-icon" onClick={onEdit} />
        </div>

        <div className="profile-info">
          <div className="left-info">
            <img
              className="profile-image"
              onClick={() => setModalOpen(true)}
              src={
                currentProfile.imageLink ||
                currentUser?.imageLink ||
                "/default-avatar.png"
              }
              alt="profile"
            />

            <h3 className="userName">{currentProfile.name}</h3>
            <p className="heading">{currentProfile.headline}</p>

            <p className="location">
              {currentProfile.city}
              {currentProfile.city && currentProfile.country && ", "}
              {currentProfile.country}
            </p>

            {currentProfile.website && (
              <a
                className="website"
                target="_blank"
                rel="noopener noreferrer"
                href={currentProfile.website}
              >
                {currentProfile.website}
              </a>
            )}
          </div>

          <div className="right-info">
            <p className="college">{currentProfile.college}</p>
            <p className="company">{currentProfile.company}</p>
          </div>
        </div>

        <p className="about-me">{currentProfile.aboutMe}</p>

        <p className="skills">
          <span className="skill-label">Skills</span>: {currentProfile.skills}
        </p>
      </div>

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

