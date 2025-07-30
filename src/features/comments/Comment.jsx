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
//   const comments = useSelector(selectCommentsByTask(taskId));
const rawComments = useSelector(selectCommentsByTask(taskId));
const comments = rawComments.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [showModal, setShowModal] = useState(false);
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

  const handleEdit = (comment) => {
    setEditId(comment.id);
    setEditText(comment.text);
  };

  const handleUpdate = () => {
    if (editText.trim()) {
      dispatch(updateComment({ id: editId, text: editText }));
      setEditId(null);
      setEditText("");
    }
  };

  const confirmDelete = () => {
    dispatch(deleteComment(commentToDelete));
    setCommentToDelete(null);
    setShowModal(false);
  };

  return (
    <div style={{ paddingTop: "1rem", borderTop: "1px solid #ccc" }}>
      <strong>Comments:</strong>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <div>
              <strong>{c.user}:</strong>{" "}
              {c.deleted ? (
                <em style={{ color: "gray" }}>[deleted]</em>
              ) : editId === c.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </>
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
                        <button onClick={() => handleEdit(c)}>Edit</button>{" "}
                        <button
                          onClick={() => {
                            setCommentToDelete(c);
                            setShowModal(true);
                          }}
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

      <input
        type="text"
        value={text}
        placeholder="Write a comment..."
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAdd}>Post</button>

      {/* Confirmation Modal */}
      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <p>Are you sure you want to delete this comment?</p>
            <div style={{ marginTop: "1rem" }}>
              <button onClick={confirmDelete}>Yes</button>{" "}
              <button
                onClick={() => {
                  setShowModal(false);
                  setCommentToDelete(null);
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
