const AddProjectForm = ({ title, setTitle, handleAddProject }) => {
  return (
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
  );
};

export default AddProjectForm;
