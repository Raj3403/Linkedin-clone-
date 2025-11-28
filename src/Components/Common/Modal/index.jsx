import React from "react";
import { Modal, Button } from "antd";
import "./index.scss";

const ModalComponent = ({
  modalOpen,
  setModalOpen,
  SetStatus,
  sendStatus,
  status,
  isEdit,
  updateStatus,
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
            { isEdit ? "Update" :  "Post"}
          </Button>,
        ]}
      >
        <input
          className="modal-input"
          placeholder="What do you want to talk about?"
          onChange={(event) => SetStatus(event.target.value)}
          value={status}
        />
      </Modal>
    </>
  );
};
export default ModalComponent;
