import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "src/store/slices/apiSlice";
import { uiSlice } from "./slices/uiSlice";
import { loadingSlice } from "./slices/loadingSlice";

// A factory rather than a bare store, so that tests can run against
// a store that starts from the initial state
export function createAppStore() {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      [uiSlice.reducerPath]: uiSlice.reducer,
      [loadingSlice.reducerPath]: loadingSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
}

export const store = createAppStore();

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
