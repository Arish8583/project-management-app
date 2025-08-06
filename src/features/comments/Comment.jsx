import React from "react";
import EditCommentModal from "./EditCommentModal";
import DeleteCommentModal from "./DeleteCommentModal";
import CommentListItem from "./CommentListItem";
import CommentInput from "./CommentInput";
import { useCommentSectionLogic } from "./useCommentSectionLogic";

const CommentSection = ({ taskId }) => {
  const {
    user,
    comments,
    text,
    setText,
    editModalOpen,
    setEditModalOpen,
    editId,
    setEditId,
    editText,
    setEditText,
    showDeleteModal,
    setShowDeleteModal,
    commentToDelete,
    setCommentToDelete,
    handleAdd,
    handleUpdate,
    handleDelete,
    resetEdit,
    resetDelete,
  } = useCommentSectionLogic(taskId);

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
        <DeleteCommentModal onCancel={resetDelete} onConfirm={handleDelete} />
      )}
    </div>
  );
};

export default CommentSection;
