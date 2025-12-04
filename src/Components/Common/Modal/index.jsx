import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Progress } from "antd";
import ReactQuill from 'react-quill';
import { AiOutlinePicture } from "react-icons/ai";
import "./index.scss";

const ModalComponent = ({
  modalOpen,
  setModalOpen,
  SetStatus,
  sendStatus,
  status,
  isEdit,
  updateStatus,
  UploadPostImage, // should return the uploaded URL (string) or an object with { url }
  setPostImage, // parent setter for storing final image URL
  imageUrl, // current image URL from parent
  currentPost,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Local preview URL (either object URL while uploading or final uploaded URL)
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null); // keep track to revoke

  // When modal opens in edit mode, sync preview with existing post image
  useEffect(() => {
    if (modalOpen) {
      if (isEdit && currentPost?.postImage) {
        setPreviewUrl(currentPost.postImage);
        // Also inform parent (in case parent needs it)
        setPostImage && setPostImage(currentPost.postImage);
      } else {
        // fresh create
        setPreviewUrl(imageUrl || "");
      }
    }
    // do not revoke here — we keep preview until modal closed or replaced
  }, [modalOpen, isEdit, currentPost, imageUrl, setPostImage]);

  // Revoke any created object URL when component unmounts or when preview replaced
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  // Cleaner to reset everything (call on cancel or after submit)
  const clearAll = () => {
    // reset parent status
    SetStatus && SetStatus("");
    // clear parent post image state
    setPostImage && setPostImage("");
    // clear local preview
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewUrl("");
    setProgress(0);
    setUploading(false);
    // reset file input so same file can be picked again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeModal = () => {
    clearAll();
    setModalOpen(false);
  };

  // Upload Handler:
  // - show immediate preview using object URL
  // - call UploadPostImage(file) which should return final URL (or object with {url})
  const handleImageUpload = async (file) => {
    if (!file) return;

    // create instant preview
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);

    // notify parent that we have a preview (optional)
    // We don't call setPostImage with objectUrl because parent likely expects stored final URL,
    // but if you want to show parent the preview too, you may call setPostImage(objectUrl)
    // setPostImage && setPostImage(objectUrl);

    setUploading(true);
    setProgress(0);

    // Smooth fake loader until 90%
    const fakeInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(fakeInterval);
          return 90;
        }
        return p + 4;
      });
    }, 140);

    try {
      // call your upload function. It may return:
      // - a string URL
      // - an object like { url: "..." }
      // - or it may accept a callback; we try to handle the common return types.
      const uploadResult = await UploadPostImage(file);

      clearInterval(fakeInterval);

      // determine final url
      const finalUrl =
        uploadResult && typeof uploadResult === "object"
          ? uploadResult.url ?? uploadResult.downloadURL ?? uploadResult?.data?.url
          : uploadResult;

      const uploadedUrl = typeof finalUrl === "string" ? finalUrl : null;

      // If UploadPostImage returned a final URL, show it. Otherwise keep the object URL as preview.
      if (uploadedUrl) {
        // revoke object URL (we'll display final URL instead)
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }
        setPreviewUrl(uploadedUrl);
        // update parent so their state has final url too
        setPostImage && setPostImage(uploadedUrl);
      } else {
        // No final URL returned: keep object URL preview, but still inform parent if desired
        // setPostImage && setPostImage(objectUrl);
      }

      // finish progress
      setProgress(100);
      // small delay so user sees 100%
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 400);
    } catch (err) {
      clearInterval(fakeInterval);
      console.error("Upload failed:", err);
      setUploading(false);
      setProgress(0);
      // keep object preview so user can re-upload or remove
    }
  };

  // Optional: remove image button handler
  const removeImage = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewUrl("");
    setPostImage && setPostImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // If user submits (create or update), we clear afterwards.
  // But DO NOT automatically close modal here — keep existing behavior.
  const handleSubmit = async () => {
    if (isEdit) {
      await updateStatus();
    } else {
      await sendStatus();
    }
    // after parent completes saving, clear and close modal
    clearAll();
    setModalOpen(false);
  };

  return (
    <Modal
      title={isEdit ? "Edit Post" : "Create a Post"}
      centered
      open={modalOpen}
      onCancel={closeModal}
      footer={[
        <Button
          key="submit"
          type="primary"
          disabled={status.length === 0 || uploading}
          onClick={handleSubmit}
        >
          {uploading ? "Uploading..." : isEdit ? "Update" : "Post"}
        </Button>,
      ]}
    >
      {/* <textarea
        rows={3}
        className="modal-input"
        placeholder="What do you want to talk about?"
        onChange={(e) => SetStatus(e.target.value)}
        value={status}
      /> */}
      <ReactQuill className="modal-input" placeholder="Share Something Useful..." theme="snow" value={status} onChange={SetStatus} />

      {/* IMAGE PREVIEW */}
      {previewUrl ? (
        <div style={{ position: "relative", marginTop: 12 }}>
          <img className="preview-image" src={previewUrl} alt="preview" />
          <button
            type="button"
            onClick={removeImage}
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "4px 6px",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      ) : null}

      {/* PROGRESS CIRCLE */}
      {uploading && (
        <div className="upload-progress-container" style={{ marginTop: 12 }}>
          <Progress
            type="circle"
            percent={progress}
            size={70}
            status={progress === 100 ? "success" : "active"}
          />
        </div>
      )}

      {/* UPLOAD ICON */}
      <label htmlFor="upload-img-btn" style={{ cursor: "pointer", display: "inline-block", marginTop: 12 }}>
        <AiOutlinePicture className="picture-icon" size={40} />
      </label>

      <input
        id="upload-img-btn"
        type="file"
        accept="image/*"
        hidden
        ref={fileInputRef}
        onChange={(e) => {
          const f = e.target.files && e.target.files[0];
          if (f) handleImageUpload(f);
        }}
      />
    </Modal>
  );
};

export default ModalComponent;
