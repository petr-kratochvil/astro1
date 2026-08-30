import { createSlice } from "@reduxjs/toolkit";

// Global "waiting for data" state
// Components decide whether they are waiting, rather then using state.api.queries
// This is useful in TransitsPage, where older requests still are fetched and cached,
// but the loading indicator should not regard them as blockers
export const loadingSlice = createSlice({
  name: "loading",
  initialState: { busyCount: 0 },
  reducers: {
    startBusy(state) {
      state.busyCount += 1;
    },
    endBusy(state) {
      state.busyCount = Math.max(0, state.busyCount - 1);
    },
  },
  selectors: {
    selectIsBusy: (state) => state.busyCount > 0,
  },
});

export const { startBusy, endBusy } = loadingSlice.actions;
export const { selectIsBusy } = loadingSlice.selectors;
