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
  setCurrentImage,
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
        }}
        onCancel={() => {
          SetStatus("");
          setModalOpen(false);
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
        <label htmlFor="pic-upload"><AiOutlinePicture size={35} className="picture-icon"/> </label>
        <input type={"file"} id="pic-upload"  hidden  onChange={(event) => setCurrentImage(event.target.files[0])}/>
      </Modal>
    </>
  );
};
export default ModalComponent;
