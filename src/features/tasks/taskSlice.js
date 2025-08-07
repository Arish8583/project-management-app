import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const TASKS_URL = "http://localhost:3500/tasks";

const initialState = {
  tasks: [],
  status: "idle",
  error: null,
};

// Thunk to fetch tasks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const res = await axios.get(TASKS_URL);
  return res.data;
});

// Thunk to add a new task
export const addTask = createAsyncThunk("tasks/addTask", async (taskData) => {
  const newTask = {
    ...taskData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  const res = await axios.post(TASKS_URL, newTask);
  return res.data;
});

// Thunk to update a task
export const updateTask = createAsyncThunk("tasks/updateTask", async (taskData) => {
  const res = await axios.put(`${TASKS_URL}/${taskData.id}`, taskData);
  return res.data;
});

// ✅ Thunk to delete a task
export const deleteTask = createAsyncThunk("tasks/deleteTask", async (taskId) => {
  await axios.delete(`${TASKS_URL}/${taskId}`);
  return taskId;
});

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // ✅ Handle deleteTask
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

// Selectors
export const selectTasks = (state) => state.tasks.tasks;

export const selectTasksByProject = (state, projectId) =>
  state.tasks.tasks.filter((task) => task.projectId === projectId);

export default taskSlice.reducer;


