import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { savedDataSlice } from "./savedDataSlice";

export const DEFAULT_EDIT_REFERER = "/saved-data";

export const uiSlice = createSlice({
  name: "ui",
  // selectedBaseDateIndex - selected record used for transits or natal chart
  // selectedDateTimestamp - date picked in DateNavigation, shared by every page using it
  // refererOfEditPage - where to navigate after closing record edit form
  initialState: {
    selectedBaseDateIndex: 0,
    selectedDateTimestamp: new Date().getTime(),
    refererOfEditPage: DEFAULT_EDIT_REFERER,
  },
  reducers: {
    selectBaseDate(state, action: PayloadAction<number>) {
      state.selectedBaseDateIndex = action.payload;
    },
    setSelectedDateTimestamp(state, action: PayloadAction<number>) {
      state.selectedDateTimestamp = action.payload;
    },
    setRefererOfEditPage(state, action: PayloadAction<string>) {
      state.refererOfEditPage = action.payload;
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

export const {
  selectBaseDate,
  setSelectedDateTimestamp,
  setRefererOfEditPage,
} = uiSlice.actions;
