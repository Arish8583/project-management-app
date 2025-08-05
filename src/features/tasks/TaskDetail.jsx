import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchTasks,
  updateTask,
  deleteTask,
  selectTasks,
} from "./taskSlice";
import {
  fetchUsers,
  selectAllUsers,
  selectUser,
} from "../auth/auth";
import {
  fetchComments,
  addComment,
  updateComment,
  deleteComment,
  selectCommentsByTask,
} from "../comments/commentSlice";
import CommentSection from "../comments/Comment";

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const users = useSelector(selectAllUsers);
  const tasks = useSelector(selectTasks);
  const comments = useSelector(selectCommentsByTask(taskId));

  const task = tasks.find((t) => t.id === taskId);

  const [editTask, setEditTask] = useState(false);
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [assignee, setAssignee] = useState(task?.assigneeId || "");

  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
    dispatch(fetchComments());
  }, [dispatch]);

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setAssignee(task?.assigneeId || "");
  }, [task]);

  const handleUpdateTask = () => {
    if (!title.trim() || !description.trim()) return;
    dispatch(updateTask({ ...task, title, description, assigneeId: assignee }));
    setEditTask(false);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteTask(taskToDelete.id));
    setTaskToDelete(null);
    navigate(-1); // go back
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📝 Task Detail</h2>

      <div>
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p>
          <strong>Assignee:</strong>{" "}
          {users.find((u) => u.id === task.assigneeId)?.name || "Not assigned"}
        </p>
        <button onClick={() => setEditTask(true)}>✏️ Edit</button>
        <button
          onClick={() => setTaskToDelete(task)}
          style={{ color: "red", marginLeft: "8px" }}
        >
          🗑 Delete
        </button>
      </div>

      {/* ===== EDIT TASK POPUP ===== */}
      {editTask && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>Edit Task</h3>
            <label>Title:</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              style={inputStyle}
            />
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows="4"
              style={inputStyle}
            />
            <label>Assignee:</label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              style={inputStyle}
            >
              <option value="">-- Assign --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <div style={{ textAlign: "right" }}>
              <button onClick={handleUpdateTask} style={{ marginRight: "10px" }}>
                💾 Save
              </button>
              <button onClick={() => setEditTask(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE TASK POPUP ===== */}
      {taskToDelete && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{taskToDelete.title}</strong>?</p>
            <div style={{ textAlign: "right" }}>
              <button
                onClick={handleConfirmDelete}
                style={{ backgroundColor: "red", color: "#fff", marginRight: "10px" }}
              >
                Delete
              </button>
              <button onClick={() => setTaskToDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <hr />
      <CommentSection taskId={task.id} />
    </div>
  );
};

// Popup styles
const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modalStyle = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "10px",
  width: "350px",
  maxWidth: "90%",
  textAlign: "left",
};

const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

export default TaskDetailPage;
