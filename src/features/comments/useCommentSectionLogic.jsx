import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  addComment,
  updateComment,
  deleteComment,
  selectCommentsByTask,
} from "./commentSlice";
import { selectUser } from "../auth/auth";

export const useCommentSectionLogic = (taskId) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const rawComments = useSelector(selectCommentsByTask(taskId));
  const comments = [...rawComments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

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
      dispatch(
        addComment({
          taskId,
          user: user?.email || "Anonymous",
          text,
        })
      );
      setText("");
    }
  };

  const handleUpdate = (updatedText) => {
    if (updatedText.trim()) {
      dispatch(updateComment({ id: editId, text: updatedText }));
      resetEdit();
    }
  };

  const handleDelete = () => {
    if (commentToDelete) {
      dispatch(deleteComment(commentToDelete));
      resetDelete();
    }
  };

  const resetEdit = () => {
    setEditModalOpen(false);
    setEditId(null);
    setEditText("");
  };

  const resetDelete = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  return {
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
  };
};
