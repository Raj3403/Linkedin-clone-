import React from "react";
import { Modal, Button } from "antd";
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
  return (
    <>
      <Modal
        title="Create a Post"
        centered
        open={modalOpen}
        onOk={() => {
          SetStatus("");
          setModalOpen(false);
          setPostImage("");
        }}
        onCancel={() => {
          SetStatus("");
          setModalOpen(false);
          setPostImage("");
        }}
        footer={[
          <Button
            onClick={isEdit ? updateStatus : sendStatus}
            key="submit"
            type="primary"
            disabled={status.length > 0 ? false : true}
          >
            {isEdit ? "Update" : "Post"}
          </Button>,
        ]}
      >
        <textarea
          rows={3}
          cols={3}
          className="modal-input"
          placeholder="What do you want to talk about?"
          onChange={(event) => SetStatus(event.target.value)}
          value={status}
        />
        {imageUrl?.length >0 ?  <img  className="preview-image" src={imageUrl} alt="imageUrl" /> : <></>}
        <label htmlFor="pic-upload"><AiOutlinePicture size={35} className="picture-icon"/> </label>
        <input type={"file"} id="pic-upload"  hidden  onChange={(event) => UploadPostImage(event.target.files[0] , setPostImage)}/>
      </Modal>
    </>
  );
};
export default ModalComponent;
