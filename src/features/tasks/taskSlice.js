import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const TASK_URL = "http://localhost:3500/tasks";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const res = await axios.get(TASK_URL);
  return res.data;
});

export const addTask = createAsyncThunk("tasks/addTask", async (task) => {
  const res = await axios.post(TASK_URL, task);
  return res.data;
});

export const updateTask = createAsyncThunk("tasks/updateTask", async (task) => {
  const res = await axios.put(`http://localhost:3500/tasks/${task.id}`, task);
  return res.data;
});


export const deleteTask = createAsyncThunk("tasks/deleteTask", async (taskId) => {
  await axios.delete(`${TASK_URL}/${taskId}`);
  return taskId;
});


const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.status = "succeeded";
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
  const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
  if (idx !== -1) state.tasks[idx] = action.payload;
})
.addCase(deleteTask.fulfilled, (state, action) => {
  state.tasks = state.tasks.filter((task) => task.id !== action.payload);
})


  },
});

export default taskSlice.reducer;
export const selectTasks = (state) => state.tasks.tasks;
