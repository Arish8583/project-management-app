import TaskColumn from "./TaskColumn";

const TaskColumnsContainer = ({ columns, projectTasks }) => {
  return (
    <div className="task-columns-container">
      {columns.map((col) => (
        <TaskColumn
          key={col}
          columnId={col}
          tasks={projectTasks.filter((task) => task.status === col)}
        />
      ))}
    </div>
  );
};

export default TaskColumnsContainer;
