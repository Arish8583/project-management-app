import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchComments, addComment, updateComment, deleteComment, selectCommentsByTask} from "./commentSlice";
import { selectUser } from "../auth/auth";
import EditCommentModal from "./EditCommentModal";
import DeleteCommentModal from "./DeleteCommentModal";
import CommentListItem from "./CommentListItem";
import CommentInput from "./CommentInput";

const CommentSection = ({ taskId }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const rawComments = useSelector(selectCommentsByTask(taskId));
  const comments = [...rawComments].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt));

  const [text, setText] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => { dispatch(fetchComments()); }, [dispatch]);

  const resetEdit = () => {
    setEditModalOpen(false); setEditId(null); setEditText("");
  };

  const resetDelete = () => {
    setShowDeleteModal(false); setCommentToDelete(null);
  };

  const handleAdd = () => {
    if (text.trim()) {
      dispatch(addComment({ taskId, user: user?.email || "Anonymous", text }));
      setText("");
    }
  };

  const handleUpdate = (updatedText) => {
    if (updatedText.trim()) {
      dispatch(updateComment({ id: editId, text: updatedText }));
      resetEdit();
    }
  };

  return (
    <div style={{ paddingTop: "1rem", borderTop: "1px solid #ccc" }}>
      <strong>Comments:</strong>

      <CommentInput text={text} setText={setText} onSubmit={handleAdd} />

      <ul>
        {comments.map((c) => (
          <CommentListItem
            key={c.id}
            comment={c}
            currentUser={user}
            onEdit={() => {
              setEditId(c.id);
              setEditText(c.text);
              setEditModalOpen(true);
            }}
            onDelete={() => {
              setCommentToDelete(c);
              setShowDeleteModal(true);
            }}
          />
        ))}
      </ul>

      {editModalOpen && (
        <EditCommentModal
          initialText={editText}
          onClose={resetEdit}
          onUpdate={handleUpdate}
        />
      )}

      {showDeleteModal && (
        <DeleteCommentModal
          onCancel={resetDelete}
          onConfirm={() => {
            dispatch(deleteComment(commentToDelete));
            resetDelete();
          }}
        />
      )}
    </div>
  );
};

export default CommentSection;
