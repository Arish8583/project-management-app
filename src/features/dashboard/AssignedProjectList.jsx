import ProjectList from "./ProjectList";

const AssignedProjectList = ({ projects }) => {
  return (
    <>
      <h3>🧑‍💼 Projects You're Assigned To</h3>
      {projects.length === 0 ? (
        <p>No assigned tasks/projects yet.</p>
      ) : (
        <ProjectList projects={projects} heading="" />
      )}
    </>
  );
};

export default AssignedProjectList;
