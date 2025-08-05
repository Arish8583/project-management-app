import React from "react";

const CommentListItem = ({ comment, currentUser, onEdit, onDelete }) => {
  return (
    <li>
      <div>
        <strong>{comment.user}:</strong>{" "}
        {comment.deleted ? (
          <em style={{ color: "gray" }}>[deleted]</em>
        ) : (
          <>
            {comment.text}
            {comment.edited && (
              <span style={{ fontSize: "0.8em", color: "gray" }}> (edited)</span>
            )}
            <div style={{ marginTop: 5 }}>
              {currentUser?.email === comment.user && !comment.deleted && (
                <>
                  <button onClick={() => onEdit(comment)}>Edit</button>
                  <button
                    onClick={() => onDelete(comment)}
                    style={{ marginLeft: "6px" }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </li>
  );
};

export default CommentListItem;
