import React, { useState, useEffect } from "react";

const EditCommentModal = ({ initialText, onClose, onUpdate }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Comment</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="modal-textarea"
        />
        <div style={{ marginTop: "1rem" }}>
          <button onClick={() => onUpdate(text)}>Update</button>{" "}
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditCommentModal;
