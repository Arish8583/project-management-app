import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks, addTask } from "../features/tasks/taskSlice";
import { v4 as uuidv4 } from "uuid";
import { selectUser } from "../features/auth/auth";

const TaskBoard = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const users = useSelector(selectUser); // assuming current user
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigneeId: users.id,
    status: "todo",
  });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addTask({
        ...newTask,
        id: uuidv4(),
        projectId,
        createdBy: users.id,
        createdAt: new Date().toISOString(),
      })
    );
    setNewTask({ title: "", description: "", assigneeId: users.id, status: "todo" });
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Project Board</h2>

      <button onClick={() => setIsModalOpen(true)}>➕ Create Task</button>

      {isModalOpen && (
        <form onSubmit={handleSubmit} style={{ background: "#eee", padding: "1rem", marginTop: "1rem" }}>
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task Title"
            required
          />
          <br />
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Task Description"
            required
          />
          <br />
          <button type="submit">Create</button>
        </form>
      )}

      <hr />
      <h3>Tasks</h3>
      <ul>
        {tasks
          .filter((t) => t.projectId === projectId)
          .map((task) => (
            <li key={task.id}>
              📝 {task.title} - {task.status}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TaskBoard;
