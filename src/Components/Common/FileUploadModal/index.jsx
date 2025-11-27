// import React from "react";
// import { Button, Modal, Progress } from "antd";
// import "./index.scss";

// export default function FileUploadModal({
//   modalOpen,
//   setModalOpen,
//   getImage,
//   uploadImage,
//   currentImage,
//   progress ,// optional, you can ignore if not using
// }) {
//   return (
//     <div>
//       <Modal
//         title="Add a Profile Image"
//         centered
//         open={modalOpen}
//         onCancel={() => setModalOpen(false)}
//         footer={[
//           <Button
//             key="submit"
//             type="primary"
//             onClick={uploadImage}
//             disabled={!currentImage || !currentImage.name}
//           >
//             Upload Profile Picture
//           </Button>,
//         ]}
//       >
//         <div className="image-upload-main">
//           <p>{currentImage?.name}</p>

//           <label className="upload-btn" htmlFor="image-upload">
//             Add an Image
//           </label>

//                  {/* === PROGRESS BAR === */}
//         {progress > 0 && (
//           <Progress
//             percent={progress}
//             status={progress === 100 ? "success" : "active"}
//           />
//         )}

//           <input hidden id="image-upload" type="file" onChange={getImage} />
//         </div>
//       </Modal>
//     </div>
//   );
// }

// FileUploadModal.jsx
// import React from "react";
// import { Button, Modal, Flex, Progress } from "antd";
// import "./index.scss";

// function FileUploadModal({
//   modalOpen,
//   setModalOpen,
//   getImage,
//   uploadImage,
//   currentImage,
//   progress,
// }) {


//   return (
//     <Modal
//       title="Add a Profile Image"
//       centered
//       open={modalOpen}
//       onCancel={() => setModalOpen(false)}
//       footer={[
//         <Button key="cancel" onClick={() => setModalOpen(false)}>
//           Cancel
//         </Button>,
//      <Button
//             key="submit"
//             type="primary"
//             onClick={uploadImage}
//             disabled={!currentImage || !currentImage.name}
//           >
//             Upload Profile Picture
//           </Button>,
//       ]}
//     >
//       <Flex vertical gap={16}>
//         <input type="file" accept="image/*" onChange={getImage} />

//         {progress > 0 && (
//           <Progress
//             percent={progress}
//             status={progress === 100 ? "success" : "active"}
//           />
//         )}
//       </Flex>
//     </Modal>
//   );
// }

// export default FileUploadModal;


// FileUploadModal.jsx
import React from "react";
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

  // decide how the circle should look
  let circlePercent = 0;
  let circleStatus = undefined;

  if (progress > 0 && progress < 100) {
    circlePercent = progress;
    circleStatus = "active";
  } else if (progress === 100) {
    circlePercent = 100;
    circleStatus = "success";
  } else if (hasFile) {
    // file selected but upload not started yet -> show full green tick
    circlePercent = 100;
    circleStatus = "success";
  }

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
 

        {/* 2. Image name */}
        <div className="image-name-section">
          {hasFile && <p className="image-name">{currentImage.name}</p>}
        </div>

        {/* 3. Add image button (label + hidden input) */}
        <div className="add-image-section">
          <label
            htmlFor="profile-image-input"
            className="add-image-button" // use your existing button styles here
          >
            Add an Image
          </label>

              {/* 1. Profile / progress section (circle) */}
        <div className="profile-section">
          <Progress
            type="circle"
            percent={circlePercent}
            status={circleStatus}
          />
        </div>
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={getImage}
          />
        </div>
      </div>
    </Modal>
  );
}

export default FileUploadModal;
