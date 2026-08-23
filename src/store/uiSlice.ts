import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { savedDataSlice } from "./savedDataSlice";

export const DEFAULT_EDIT_REFERER = "/saved-data";

export const uiSlice = createSlice({
  name: "ui",
  // selectedBaseDateIndex - selected record used for transits or natal chart
  // transitDateTimestamp - user selected transit date (on TransitsPage.tsx)
  // refererOfEditPage - where to navigate after closing record edit form
  initialState: {
    selectedBaseDateIndex: 0,
    transitDateTimestamp: new Date().getTime(),
    refererOfEditPage: DEFAULT_EDIT_REFERER,
  },
  reducers: {
    selectBaseDate(state, action: PayloadAction<number>) {
      state.selectedBaseDateIndex = action.payload;
    },
    setTransitDateTimestamp(state, action: PayloadAction<number>) {
      state.transitDateTimestamp = action.payload;
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

export const { selectBaseDate, setTransitDateTimestamp, setRefererOfEditPage } =
  uiSlice.actions;
