import CommentSection from "../comments/Comment";
import TaskInfo from "./TaskInfo";
import TaskActions from "./TaskActions";
import TaskEditModalWrapper from "./TaskEditModalWrapper";
import TaskDeleteModalWrapper from "./TaskDeleteModalWrapper";
import { useTaskDetailLogic } from "./useTaskDetailLogic";

const TaskDetailPage = () => {
  const {
    task,
    assigneeName,
    editTask,
    taskToDelete,
    setEditTask,
    setTaskToDelete,
    handleDelete,
    handleUpdate,
    users,
  } = useTaskDetailLogic();

  if (!task) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📝 Task Detail</h2>

      <TaskInfo task={task} assignee={assigneeName} />

      <TaskActions
        onEdit={() => setEditTask(true)}
        onDelete={() => setTaskToDelete(task)}
      />

      <TaskEditModalWrapper
        open={editTask}
        task={task}
        users={users}
        onClose={() => setEditTask(false)}
        onSave={handleUpdate}
      />

      <TaskDeleteModalWrapper
        task={taskToDelete}
        onCancel={() => setTaskToDelete(null)}
        onConfirm={handleDelete}
      />

      <hr />
      <CommentSection taskId={task.id} />
    </div>
  );
};

export default TaskDetailPage;
