import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "src/store/slices/apiSlice";
import { uiSlice } from "./slices/uiSlice";
import { loadingSlice } from "./slices/loadingSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [uiSlice.reducerPath]: uiSlice.reducer,
    [loadingSlice.reducerPath]: loadingSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
