import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

const TaskColumn = ({ columnId, tasks }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            flex: 1,
            padding: "1rem",
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
            minHeight: "300px",
          }}
        >
          <h4>{columnId.toUpperCase()}</h4>
          {tasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TaskColumn;
