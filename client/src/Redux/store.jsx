import { configureStore } from "@reduxjs/toolkit";
import loadingSlice from "./slices/LoadingSlice";
import AuthSlice from "./slices/AuthSlice";
import EventAuthSlice from "./slices/EventAuthSlice";
import AdminAuthSlice from "./slices/AdminAuthSlice";
import themeSlice from "./slices/ThemeSlice";
import commentsSlice from "./Comments/CommentSlice";
import { commentsApi } from "./Comments/CommentApi";

const store = configureStore({
  reducer: {
    loadings: loadingSlice,
    Auth: AuthSlice,
    EventAuth: EventAuthSlice,
    AdminAuth: AdminAuthSlice,
    SetTheme: themeSlice,
    comments: commentsSlice,
    [commentsApi.reducerPath]: commentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(commentsApi.middleware),
});

export default store;
