import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { savedDataSlice } from "./savedDataSlice";

export const uiSlice = createSlice({
  name: "ui",
  // selectedBaseDateIndex - selected record used for transits or natal chart
  initialState: { selectedBaseDateIndex: 0 },
  reducers: {
    selectBaseDate(state, action: PayloadAction<number>) {
      state.selectedBaseDateIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Records shifted position - fall back to the first record.
    builder.addMatcher(
      savedDataSlice.endpoints.deleteBaseDate.matchFulfilled,
      (state) => {
        state.selectedBaseDateIndex = 0;
      }
    );
  },
});

export const { selectBaseDate } = uiSlice.actions;