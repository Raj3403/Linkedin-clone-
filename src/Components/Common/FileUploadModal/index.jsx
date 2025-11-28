import React, { useState, useEffect } from "react";
import { Button, Modal, Progress } from "antd";
import "./index.scss";

function FileUploadModal({
  modalOpen,
  setModalOpen,
  getImage,
  uploadImage,
  currentImage,
  progress,
}) {
  const hasFile = !!currentImage?.name;

  // ✅ Load last file name from localStorage on first render
  const [lastFileName, setLastFileName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("profileImageName") || "";
    }
    return "";
  });

  // ✅ When a new image is selected, update state + localStorage
  useEffect(() => {
    if (currentImage?.name) {
      setLastFileName(currentImage.name);
      if (typeof window !== "undefined") {
        localStorage.setItem("profileImageName", currentImage.name);
      }
    }
  }, [currentImage]);

  const displayedName = currentImage?.name || lastFileName;

  // ✅ Control showing the success (✓) state briefly
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 1500); // show tick for 1.5s then hide
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <Modal
      title="Add a Profile Image"
      centered
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setModalOpen(false)}>
          Cancel
        </Button>,
        <Button
          key="upload"
          type="primary"
          onClick={uploadImage}
          disabled={!hasFile || progress > 0}
        >
          Upload Profile Picture
        </Button>,
      ]}
    >
      <div className="file-upload-modal">
        {/* 1. Image name */}
        <div className="image-name-section">
          {displayedName && <p className="image-name">{displayedName}</p>}
        </div>

        {/* 2. Add image button (label + hidden input) */}
        <div className="add-image-section">
          <label htmlFor="profile-image-input" className="add-image-button">
            Add an Image
          </label>

          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={getImage}
          />
        </div>

        {/* 3. Progress bar (circle) */}
        <div className="profile-section">
          {/* Upload in progress */}
          {progress > 0 && progress < 100 && (
            <Progress type="circle" percent={progress} status="active" />
          )}

          {/* Upload success (✓), then auto-hide */}
          {showSuccess && (
            <Progress type="circle" percent={100} status="success" />
          )}
        </div>
      </div>
    </Modal>
  );
}

export default FileUploadModal;
