import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProject, fetchProjects, selectProjects } from "../features/projects/ProjectSlice";
import { selectUser } from "../features/auth/auth";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const projects = useSelector(selectProjects); 
  const currentUser = useSelector(selectUser);

  const [title, setTitle] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch(addProject({ title, createdBy: user.id }));
    setTitle("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👋 Welcome, {user?.email}</h2>

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

      <h3>Your Projects</h3>
      <ul>
        {projects
          .filter((p) => p.createdBy === user?.id)
          .map((project) => (
            <>
              {/* <li key={project.id}>📁 {project.title}</li> */}
              <li key={project.id}><Link to={`/projects/${project.id}`}>📁 {project.title}</Link></li>
            </>

          ))}
      </ul>
    </div>
  );
};

export default Dashboard;
