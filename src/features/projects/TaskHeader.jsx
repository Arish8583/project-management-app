const TaskHeader = ({ onCreate }) => {
  return (
    <div className="task-header">
      <h2>📋 Project Tasks</h2>
      <button onClick={onCreate}>➕ Create Task</button>
    </div>
  );
};

export default TaskHeader;
