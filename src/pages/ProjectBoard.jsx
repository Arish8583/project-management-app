import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
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
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigneeId: currentUser?.id || "",
    status: "todo",
  });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editValues, setEditValues] = useState({});

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

  const handleEditSave = (taskId) => {
  const originalTask = projectTasks.find((t) => t.id === taskId);
  if (!originalTask) return;

  const updated = {
    ...originalTask, // preserve status, projectId, etc.
    ...editValues,   // override title, description, assignee
  };

  dispatch(updateTask(updated));
  setEditingTaskId(null);
  setEditValues({});
};


  const handleEditCancel = () => {
    setEditingTaskId(null);
    setEditValues({});
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
                            {editingTaskId === task.id ? (
                              <>
                                <input
                                  value={editValues.title}
                                  onChange={(e) =>
                                    setEditValues({
                                      ...editValues,
                                      title: e.target.value,
                                    })
                                  }
                                />
                                <textarea
                                  value={editValues.description}
                                  onChange={(e) =>
                                    setEditValues({
                                      ...editValues,
                                      description: e.target.value,
                                    })
                                  }
                                />
                                <br />
                                <select
                                  value={editValues.assigneeId}
                                  onChange={(e) =>
                                    setEditValues({
                                      ...editValues,
                                      assigneeId: e.target.value,
                                    })
                                  }
                                >
                                  {allUsers.map((u) => (
                                    <option key={u.id} value={u.id}>
                                      {u.email}
                                    </option>
                                  ))}
                                </select>
                                <br />
                                <button onClick={() => handleEditSave(task.id)}>
                                  Save
                                </button>
                                <button onClick={handleEditCancel}>Cancel</button>
                              </>
                            ) : (
                              <>
                                <strong>{task.title}</strong>
                                <p>{task.description}</p>
                                <label style={{ fontSize: "0.8rem" }}>
                                  Assigned to:
                                </label>
                                <select
                                  value={task.assigneeId}
                                  onChange={(e) =>
                                    dispatch(
                                      updateTask({
                                        ...task,
                                        assigneeId: e.target.value,
                                      })
                                    )
                                  }
                                >
                                  {allUsers.map((u) => (
                                    <option key={u.id} value={u.id}>
                                      {u.email}
                                    </option>
                                  ))}
                                </select>
                                <br />
                                <button
                                  onClick={() => {
                                    setEditingTaskId(task.id);
                                    setEditValues({
                                      title: task.title,
                                      description: task.description,
                                      assigneeId: task.assigneeId,
                                    });
                                  }}
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => setTaskToDelete(task)}
                                  style={{ color: "red", marginLeft: "8px" }}
                                >
                                  🗑 Delete
                                </button>
                              </>
                            )}
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
      {taskToDelete && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        width: "300px",
        textAlign: "center",
      }}
    >
      <h3>Are you sure?</h3>
      <p>
        Delete task <strong>{taskToDelete.title}</strong>?
      </p>
      <button
        onClick={() => {
          dispatch(deleteTask(taskToDelete.id));
          setTaskToDelete(null);
        }}
        style={{ marginRight: "1rem", color: "white", background: "red" }}
      >
        Yes, Delete
      </button>
      <button onClick={() => setTaskToDelete(null)}>Cancel</button>
    </div>
  </div>
)}

    </div>
  );
};

export default TaskBoard;
