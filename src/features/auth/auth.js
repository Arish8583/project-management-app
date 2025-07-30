import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const USER_URL = "http://localhost:3500/users";

// Thunk: Login user by email & password
export const loginUser = createAsyncThunk("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${USER_URL}?email=${email}`);
    const user = res.data[0];
    if (user && user.password === password) {
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    }
    return rejectWithValue("Invalid email or password");
  } catch (error) {
    return rejectWithValue("Login failed");
  }
});

// Thunk: Fetch all users
export const fetchUsers = createAsyncThunk("auth/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(USER_URL);
    return res.data;
  } catch (error) {
    return rejectWithValue("Fetching users failed");
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  users: [],
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Login User
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectAllUsers = (state) => state.auth.users;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
