import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

const columns = ["todo", "in-progress", "done"];

const TaskBoard = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const currentUser = useSelector(selectUser);
  const allTasks = useSelector(selectTasks);
  const allUsers = useSelector(selectAllUsers);

  const projectTasks = allTasks.filter((t) => t.projectId === projectId);

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
        <form
          onSubmit={handleSubmit}
          style={{ margin: "1rem 0", background: "#eee", padding: "1rem" }}
        >
          <input
            type="text"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
            }
            placeholder="Task Title"
            required
          />
          <br />
          <textarea
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Task Description"
            required
          />
          <br />
          <select
            value={newTask.assigneeId}
            onChange={(e) =>
              setNewTask({ ...newTask, assigneeId: e.target.value })
            }
            required
          >
            <option value="">Assign to...</option>
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.email}
              </option>
            ))}
          </select>
          <br />
          <button type="submit">Create Task</button>
        </form>
      )}


      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          {columns.map((col) => (
            <Droppable key={col} droppableId={col}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "8px",
                    minHeight: "300px",
                  }}
                >
                  <h4>{col.toUpperCase()}</h4>
                  {projectTasks
                    .filter((task) => task.status === col)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              padding: "0.75rem",
                              marginBottom: "0.5rem",
                              backgroundColor: "#fff",
                              borderRadius: "4px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <strong>{task.title}</strong>
                            <p>{task.description}</p>
                            <br />
                            <Link to={`/tasks/${task.id}`}>
                              <button style={{ marginTop: "0.5rem" }}>
                                🔍 View More
                              </button>
                            </Link>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
