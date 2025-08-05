const TaskInfo = ({ task, assignee }) => (
  <div>
    <h3>{task.title}</h3>
    <p>{task.description}</p>
    <p><strong>Status:</strong> {task.status}</p>
    <p><strong>Assignee:</strong> {assignee || "Not assigned"}</p>
  </div>
);

export default TaskInfo;
