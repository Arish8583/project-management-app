import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const COMMENT_URL = 'http://localhost:3500/comments';

export const fetchComments = createAsyncThunk("comments/fetch", async () => {
  const res = await axios.get(COMMENT_URL);
  return res.data;
});

export const addComment = createAsyncThunk("comments/add", async ({ taskId, user, text }) => {
  const newComment = {
    id: uuidv4(),
    taskId,
    user,
    text,
    createdAt: new Date().toISOString(),
  };
  const res = await axios.post(COMMENT_URL, newComment);
  return res.data;
});


export const updateComment = createAsyncThunk("comments/update", async ({ id, text }) => {
  const res = await axios.patch(`${COMMENT_URL}/${id}`, {
    text,
    edited: true,
  });
  return res.data;
});

export const deleteComment = createAsyncThunk("comments/delete", async (comment) => {
  const res = await axios.patch(`${COMMENT_URL}/${comment.id}`, {
    ...comment,
    text: "[deleted]",
    deleted: true,
  });
  return res.data;
});



const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.status = 'succeeded';
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
  const idx = state.comments.findIndex(c => c.id === action.payload.id);
  if (idx !== -1) state.comments[idx] = action.payload;
})
.addCase(deleteComment.fulfilled, (state, action) => {
  const idx = state.comments.findIndex(c => c.id === action.payload.id);
  if (idx !== -1) state.comments[idx] = action.payload;
})

  },
});

export const selectCommentsByTask = (taskId) => (state) =>
  state.comments.comments.filter((c) => c.taskId === taskId);

export default commentSlice.reducer;
