import { configureStore } from "@reduxjs/toolkit";
import { savedDataSlice } from "src/store/savedDataSlice";

export const store = configureStore({
  reducer: {
    [savedDataSlice.reducerPath]: savedDataSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(savedDataSlice.middleware),
});
