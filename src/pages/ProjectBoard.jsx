import { DragDropContext } from "@hello-pangea/dnd";
import TaskHeader from "../features/projects/TaskHeader";
import TaskColumnsContainer from "../features/projects/TaskColumnsContainer";
import CreateTaskModal from "../features/projects/CreateTaskModal";
import useTaskBoard from "../features/projects/useTaskBoard";

const columns = ["todo", "in-progress", "done"];

const TaskBoard = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    newTask,
    setNewTask,
    allUsers,
    handleSubmit,
    onDragEnd,
    projectTasks,
  } = useTaskBoard();

  return (
    <div className="taskboard-container">
      <TaskHeader onCreate={() => setIsModalOpen(true)} />

      {isModalOpen && (
        <CreateTaskModal
          newTask={newTask}
          setNewTask={setNewTask}
          users={allUsers}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <TaskColumnsContainer columns={columns} projectTasks={projectTasks} />
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
