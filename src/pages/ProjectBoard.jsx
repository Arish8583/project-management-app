import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

import {
  fetchTasks,
  addTask,
  updateTask,
  selectTasks,
} from "../features/tasks/taskSlice";
import {
  fetchUsers,
  selectUser,
  selectAllUsers,
} from "../features/auth/auth";

import TaskColumn from "../features/projects/TaskColumn";
import CreateTaskModal from "../features/projects/CreateTaskModal";

const columns = ["todo", "in-progress", "done"];

const TaskBoard = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

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

  const projectTasks = allTasks.filter((t) => t.projectId === projectId);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      ...newTask,
      id: uuidv4(),
      projectId,
      createdBy: currentUser?.id,
      createdAt: new Date().toISOString(),
    };
    dispatch(addTask(taskData));
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

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📋 Project Tasks</h2>
      <button onClick={() => setIsModalOpen(true)}>➕ Create Task</button>

      {isModalOpen && (
        <CreateTaskModal
          newTask={newTask}
          setNewTask={setNewTask}
          users={allUsers}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          {columns.map((col) => (
            <TaskColumn
              key={col}
              columnId={col}
              tasks={projectTasks.filter((task) => task.status === col)}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
