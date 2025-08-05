import React from "react";

const CommentInput = ({ text, setText, onSubmit }) => {
  return (
    <div style={{ margin: "1rem 0" }}>
      <input
        type="text"
        value={text}
        placeholder="Write a comment..."
        onChange={(e) => setText(e.target.value)}
        style={{ width: "60%", padding: "5px" }}
      />
      <button onClick={onSubmit} style={{ marginLeft: "8px" }}>
        Post
      </button>
    </div>
  );
};

export default CommentInput;
