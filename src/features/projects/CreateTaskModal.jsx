const CreateTaskModal = ({ newTask, setNewTask, users, onClose, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
      style={{ margin: "1rem 0", background: "#eee", padding: "1rem" }}
    >
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
        onChange={(e) =>
          setNewTask({ ...newTask, description: e.target.value })
        }
        placeholder="Task Description"
        required
      />
      <br />
      <select
        value={newTask.assigneeId}
        onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
        required
      >
        <option value="">Assign to...</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.email}
          </option>
        ))}
      </select>
      <br />
      <button type="submit">Create Task</button>
      <button type="button" onClick={onClose} style={{ marginLeft: "1rem" }}>
        Cancel
      </button>
    </form>
  );
};

export default CreateTaskModal;
