// import React from "react";
// import { Modal, Button } from "antd";
// import { AiOutlinePicture } from "react-icons/ai";
// import "./index.scss";

// const ModalComponent = ({
//   modalOpen,
//   setModalOpen,
//   SetStatus,
//   sendStatus,
//   status,
//   isEdit,
//   updateStatus,
//   UploadPostImage,
//   setPostImage,
//  imageUrl,
// }) => {
//   return (
//     <>
//       <Modal
//         title="Create a Post"
//         centered
//         open={modalOpen}
//         onOk={() => {
//           SetStatus("");
//           setModalOpen(false);
//           setPostImage("");
//         }}
//         onCancel={() => {
//           SetStatus("");
//           setModalOpen(false);
//           setPostImage("");
//         }}
//         footer={[
//           <Button
//             onClick={isEdit ? updateStatus : sendStatus}
//             key="submit"
//             type="primary"
//             disabled={status.length > 0 ? false : true}
//           >
//             {isEdit ? "Update" : "Post"}
//           </Button>,
//         ]}
//       >
//         <textarea
//           rows={3}
//           cols={3}
//           className="modal-input"
//           placeholder="What do you want to talk about?"
//           onChange={(event) => SetStatus(event.target.value)}
//           value={status}
//         />
//         {imageUrl?.length >0 ?  <img  className="preview-image" src={imageUrl} alt="imageUrl" /> : <></>}
//         <label htmlFor="pic-upload"><AiOutlinePicture size={35} className="picture-icon"/> </label>
//         <input type={"file"} id="pic-upload"  hidden  onChange={(event) => UploadPostImage(event.target.files[0] , setPostImage)}/>
//       </Modal>
//     </>
//   );
// };
// export default ModalComponent;





import React, { useState } from "react";
import { Modal, Button, Progress } from "antd";
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
  UploadPostImage,
  setPostImage,
  imageUrl,
}) => {

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle Image Upload with Circular Loader
  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    // Smooth fake loader until 90%
    let fakeInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(fakeInterval);
          return 90;
        }
        return prev + 3;
      });
    }, 180);

    try {
      const url = await UploadPostImage(file, setPostImage);

      clearInterval(fakeInterval);
      setProgress(100);

      // Finish upload
      setTimeout(() => {
        setUploading(false);
      }, 500);
    } catch (error) {
      clearInterval(fakeInterval);
      console.error("Upload failed:", error);
      setProgress(0);
      setUploading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    SetStatus("");
    setPostImage("");
    setProgress(0);
    setUploading(false);
  };

  return (
    <Modal
      title="Create a Post"
      centered
      open={modalOpen}
      onCancel={closeModal}
      footer={[
        <Button
          key="submit"
          type="primary"
          disabled={status.length === 0 || uploading}
          onClick={isEdit ? updateStatus : sendStatus}
        >
          {uploading ? "Uploading..." : isEdit ? "Update" : "Post"}
        </Button>,
      ]}
    >
      <textarea
        rows={3}
        className="modal-input"
        placeholder="What do you want to talk about?"
        onChange={(e) => SetStatus(e.target.value)}
        value={status}
      />

      {/* Image Preview */}
      {imageUrl ? (
        <img className="preview-image" src={imageUrl} alt="preview" />
      ) : null}

      {/* ROUND CIRCULAR LOADER */}
      {uploading && (
        <div className="upload-progress-container">
          <Progress
            type="circle"
            percent={progress}
            size={70}
            status={progress === 100 ? "success" : "active"}
          />
        </div>
      )}

      {/* Picture Upload Button */}
      <label htmlFor="post-image-upload">
        <AiOutlinePicture className="picture-icon" size={40} />
      </label>

      <input
        id="post-image-upload"
        type="file"
        hidden
        onChange={(e) => handleImageUpload(e.target.files[0])}
      />
    </Modal>
  );
};

export default ModalComponent;
