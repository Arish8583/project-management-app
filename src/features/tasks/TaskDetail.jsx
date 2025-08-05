import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks, deleteTask, selectTasks, updateTask } from "./taskSlice";
import { fetchUsers, selectAllUsers, selectUser } from "../auth/auth";
import { fetchComments } from "../comments/commentSlice";
import CommentSection from "../comments/Comment";
import TaskInfo from "./TaskInfo";
import TaskActions from "./TaskActions";
import TaskEditModalWrapper from "./TaskEditModalWrapper";
import TaskDeleteModalWrapper from "./TaskDeleteModalWrapper";

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const users = useSelector(selectAllUsers);
  const tasks = useSelector(selectTasks);
  const task = tasks.find((t) => t.id === taskId);
  const [editTask, setEditTask] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
    dispatch(fetchComments());
  }, [dispatch]);

  const assigneeName = users.find((u) => u.id === task?.assigneeId)?.name;

  const handleDelete = () => {
    dispatch(deleteTask(taskToDelete.id));
    setTaskToDelete(null);
    navigate(-1);
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📝 Task Detail</h2>

      <TaskInfo task={task} assignee={assigneeName} />

      <TaskActions
        onEdit={() => setEditTask(true)}
        onDelete={() => setTaskToDelete(task)}
      />

      <TaskEditModalWrapper
        open={editTask}
        task={task}
        users={users}
        onClose={() => setEditTask(false)}
        onSave={(updatedFields) => {
          dispatch(updateTask({ ...task, ...updatedFields }));
          setEditTask(false);
        }}
      />

      <TaskDeleteModalWrapper
        task={taskToDelete}
        onCancel={() => setTaskToDelete(null)}
        onConfirm={handleDelete}
      />

      <hr />
      <CommentSection taskId={task.id} />
    </div>
  );
};

export default TaskDetailPage;
