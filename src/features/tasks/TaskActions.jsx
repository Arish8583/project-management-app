const TaskActions = ({ onEdit, onDelete }) => (
  <div style={{ marginTop: "1rem" }}>
    <button onClick={onEdit}>✏️ Edit</button>
    <button onClick={onDelete} style={{ color: "red", marginLeft: "8px" }}>
      🗑 Delete
    </button>
  </div>
);

export default TaskActions;
