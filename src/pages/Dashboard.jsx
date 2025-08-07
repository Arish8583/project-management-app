import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProject,
  fetchProjects,
  selectProjects,
} from "../features/projects/ProjectSlice";
import {
  fetchTasks,
  selectTasks
} from "../features/tasks/taskSlice";
import { selectUser } from "../features/auth/auth";
import { Link } from "react-router-dom";
import React from "react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const projects = useSelector(selectProjects);
  const tasks = useSelector(selectTasks);

  const [title, setTitle] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks()); // 👈 fetch tasks too
  }, [dispatch]);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch(addProject({ title, createdBy: user.id }));
    setTitle("");
  };

  // Get unique projectIds where current user is assignee
  const assignedProjectIds = [
    ...new Set(
      tasks
        .filter((task) => task.assigneeId === user.id)
        .map((task) => task.projectId)
    ),
  ];

  // Get project objects for assigned projects
  const assignedProjects = projects.filter((project) =>
    assignedProjectIds.includes(project.id)
  );

  // Get projects created by the user
  const ownProjects = projects.filter((p) => p.createdBy === user?.id);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👋 Welcome, {user?.name}</h2>

      <form onSubmit={handleAddProject} style={{ marginTop: "2rem" }}>
        <input
          type="text"
          placeholder="New Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit" style={{ marginLeft: "0.5rem" }}>
          ➕ Add Project
        </button>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <h3>📁 Your Created Projects</h3>
      <ul>
        {ownProjects.map((project) => (
          <li key={project.id}>
            <Link to={`/projects/${project.id}`}>📁 {project.title}</Link>
          </li>
        ))}
      </ul>

      <hr style={{ margin: "2rem 0" }} />

      <h3>🧑‍💼 Projects You're Assigned To</h3>
      {assignedProjects.length === 0 ? (
        <p>No assigned tasks/projects yet.</p>
      ) : (
        <ul>
          {assignedProjects.map((project) => (
            <li key={project.id}>
              <Link to={`/projects/${project.id}`}>📁 {project.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
