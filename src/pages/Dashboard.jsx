import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProject, fetchProjects, selectProjects } from "../features/projects/ProjectSlice";
import { fetchTasks, selectTasks } from "../features/tasks/taskSlice";
import { selectUser } from "../features/auth/auth";

import AddProjectForm from "../features/dashboard/AddProjectForm";
import ProjectList from "../features/dashboard/ProjectList";
import AssignedProjectList from "../features/dashboard/AssignedProjectList";

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const projects = useSelector(selectProjects);
  const tasks = useSelector(selectTasks);

  const [title, setTitle] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch(addProject({ title, createdBy: user.id }));
    setTitle("");
  };

  const ownProjects = projects.filter((p) => p.createdBy === user?.id);
  const assignedProjectIds = [...new Set(tasks.filter(t => t.assigneeId === user?.id).map(t => t.projectId))];
  const assignedProjects = projects.filter((p) => assignedProjectIds.includes(p.id));

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👋 Welcome, {user?.name}</h2>

      <AddProjectForm title={title} setTitle={setTitle} handleAddProject={handleAddProject} />

      <hr style={{ margin: "2rem 0" }} />

      <ProjectList projects={ownProjects} heading="📁 Your Created Projects" />

      <hr style={{ margin: "2rem 0" }} />

      <AssignedProjectList projects={assignedProjects} />
    </div>
  );
};

export default Dashboard;
