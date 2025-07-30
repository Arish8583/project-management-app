import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth"
import projectSlice from "../features/projects/ProjectSlice"
import taskSlice from "../features/tasks/taskSlice"
import commentReducer from "../features/comments/commentSlice"

export const store = configureStore({
    reducer: {
        auth : authReducer,
        projects : projectSlice,
        tasks : taskSlice,
        comments: commentReducer, // ✅

    },
});