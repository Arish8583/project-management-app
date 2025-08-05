import DeleteTaskPopup from "./DeleteTaskModal";

const TaskDeleteModalWrapper = ({ task, onCancel, onConfirm }) => {
  if (!task) return null;

  return (
    <DeleteTaskPopup task={task} onCancel={onCancel} onConfirm={onConfirm} />
  );
};

export default TaskDeleteModalWrapper;
