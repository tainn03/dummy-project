import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import appReducer from "./reducers/appReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// Types for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
