// features/projects/useTaskBoard.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { fetchTasks, addTask, updateTask, selectTasks } from "../tasks/taskSlice";
import { fetchUsers, selectUser, selectAllUsers } from "../auth/auth";

const useTaskBoard = () => {
  const dispatch = useDispatch();
  const { projectId } = useParams();

  const currentUser = useSelector(selectUser);
  const allTasks = useSelector(selectTasks);
  const allUsers = useSelector(selectAllUsers);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigneeId: currentUser?.id || "",
    status: "todo",
  });

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, [dispatch]);

  const projectTasks = allTasks.filter((task) => task.projectId === projectId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      ...newTask,
      id: uuidv4(),
       projectId,// ✅ links task to a project
      createdBy: currentUser?.id,
      createdAt: new Date().toISOString(),
    };
    dispatch(addTask(taskData));
    resetForm();
  };

  const resetForm = () => {
    setNewTask({
      title: "",
      description: "",
      assigneeId: currentUser?.id || "",
      status: "todo",
    });
    setIsModalOpen(false);
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const movedTask = projectTasks.find((t) => t.id === draggableId);
    if (movedTask) {
      dispatch(updateTask({ ...movedTask, status: destination.droppableId }));
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    newTask,
    setNewTask,
    allUsers,
    handleSubmit,
    onDragEnd,
    projectTasks,
  };
};

export default useTaskBoard;
