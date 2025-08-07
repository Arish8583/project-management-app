import { Link } from "react-router-dom";

const ProjectList = ({ projects, heading }) => {
  return (
    <>
      <h3>{heading}</h3>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link to={`/projects/${project.id}`}>📁 {project.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ProjectList;
