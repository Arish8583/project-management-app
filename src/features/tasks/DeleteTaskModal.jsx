import React from "react";

const DeleteTaskModal = ({ task, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirm Delete</h3>
        <p>
          Are you sure you want to delete <strong>{task.title}</strong>?
        </p>
        <div className="modal-buttons" >
          <button className="delete-btn" onClick={onConfirm}>
            Delete
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
