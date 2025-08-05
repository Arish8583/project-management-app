import { Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";

const TaskCard = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            padding: "0.75rem",
            marginBottom: "0.5rem",
            backgroundColor: "#fff",
            borderRadius: "4px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            ...provided.draggableProps.style,
          }}
        >
          <strong>{task.title}</strong>
          <p>{task.description}</p>
          <Link to={`/tasks/${task.id}`}>
            <button style={{ marginTop: "0.5rem" }}>🔍 View More</button>
          </Link>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
