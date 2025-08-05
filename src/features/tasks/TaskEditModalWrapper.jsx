import EditTaskPopup from "./EditTaskModal";

const TaskEditModalWrapper = ({ open, task, users, onClose, onSave }) => {
  if (!open) return null;

  return (
    <EditTaskPopup task={task} users={users} onClose={onClose} onSave={onSave} />
  );
};

export default TaskEditModalWrapper;
