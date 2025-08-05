import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  addComment,
  updateComment,
  deleteComment,
  selectCommentsByTask,
} from "./commentSlice";
import { selectUser } from "../auth/auth";

const CommentSection = ({ taskId }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  // Memoized selector
  const rawCommentsSelector = selectCommentsByTask(taskId);
  const rawComments = useSelector(rawCommentsSelector);
  const comments = rawComments
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const [text, setText] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  const handleAdd = () => {
    if (text.trim()) {
      dispatch(addComment({ taskId, user: user?.email || "Anonymous", text }));
      setText("");
    }
  };

  const openEditModal = (comment) => {
    setEditId(comment.id);
    setEditText(comment.text);
    setEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (editText.trim()) {
      dispatch(updateComment({ id: editId, text: editText }));
      setEditModalOpen(false);
      setEditId(null);
      setEditText("");
    }
  };

  const confirmDelete = () => {
    if (commentToDelete?.id) {
      dispatch(deleteComment(commentToDelete));
      setCommentToDelete(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <div style={{ paddingTop: "1rem", borderTop: "1px solid #ccc" }}>
      <strong>Comments:</strong>

      {/* New Comment Input - Top */}
      <div style={{ margin: "1rem 0" }}>
        <input
          type="text"
          value={text}
          placeholder="Write a comment..."
          onChange={(e) => setText(e.target.value)}
          style={{ width: "60%", padding: "5px" }}
        />
        <button onClick={handleAdd} style={{ marginLeft: "8px" }}>
          Post
        </button>
      </div>

      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <div>
              <strong>{c.user}:</strong>{" "}
              {c.deleted ? (
                <em style={{ color: "gray" }}>[deleted]</em>
              ) : (
                <>
                  {c.text}
                  {c.edited && (
                    <span style={{ fontSize: "0.8em", color: "gray" }}>
                      {" "}
                      (edited)
                    </span>
                  )}
                  <div style={{ marginTop: 5 }}>
                    {user?.email === c.user && !c.deleted && (
                      <>
                        <button onClick={() => openEditModal(c)}>Edit</button>
                        <button
                          onClick={() => {
                            setCommentToDelete(c);
                            setShowDeleteModal(true);
                          }}
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
        ))}
      </ul>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <p>Are you sure you want to delete this comment?</p>
            <div style={{ marginTop: "1rem" }}>
              <button onClick={confirmDelete}>Yes</button>{" "}
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCommentToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h3>Edit Comment</h3>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={4}
              style={{ width: "100%", padding: "5px" }}
            />
            <div style={{ marginTop: "1rem" }}>
              <button onClick={handleUpdate}>Update</button>{" "}
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditId(null);
                  setEditText("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    textAlign: "center",
    minWidth: "300px",
  },
};

export default CommentSection;
