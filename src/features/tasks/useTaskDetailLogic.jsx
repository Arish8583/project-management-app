import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask, updateTask, selectTasks } from "./taskSlice";
import { fetchUsers, selectAllUsers } from "../auth/auth";
import { fetchComments } from "../comments/commentSlice";

export const useTaskDetailLogic = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete.id));
      setTaskToDelete(null);
      navigate(-1);
    }
  };

  const handleUpdate = (updatedFields) => {
    dispatch(updateTask({ ...task, ...updatedFields }));
    setEditTask(false);
  };

  return {
    task,
    assigneeName,
    editTask,
    taskToDelete,
    setEditTask,
    setTaskToDelete,
    handleDelete,
    handleUpdate,
    users,
  };
};
