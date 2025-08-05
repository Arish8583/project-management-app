import React, { useState } from "react";

const EditTaskModal = ({ task, users, onClose, onSave }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [assignee, setAssignee] = useState(task.assigneeId || "");

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;
    onSave({ title, description, assigneeId: assignee });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Task</h3>

        <label>Title:</label>
        <input
          className="modal-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description:</label>
        <textarea
          className="modal-textarea"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Assignee:</label>
        <select
          className="modal-input"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        >
          <option value="">-- Assign --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <div className="modal-buttons">
          <button className="confirm-btn" onClick={handleSubmit}>Save</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
