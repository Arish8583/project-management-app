import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// BASE URL
const PROJECT_URL = "http://localhost:3500/projects";

const initialState = {
  projects: [],
  status: "idle",
  error: null,
};


// Thunks
export const fetchProjects = createAsyncThunk("projects/fetchProjects", async () => {
  const res = await axios.get(PROJECT_URL);
  return res.data;
});

export const addProject = createAsyncThunk("projects/addProject", async ({ title, createdBy }) => {
  const newProject = {
    id: uuidv4(),
    title,
    createdBy,
    createdAt: new Date().toISOString(),
  };
  const res = await axios.post(PROJECT_URL, newProject);
  return res.data;
});

// Slice
const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.status = "succeeded";
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default projectSlice.reducer;
export const selectProjects = (state) => state.projects.projects;
