import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { SavedDate } from "src/types";
import {
  deleteBaseDate,
  getSavedData,
  setBaseDateJson,
} from "src/utils/localStorage";

// Tag type
export const SAVED_DATE_TAG = "SAVED_DATE_TAG";
// Tag ID for the list
export const SAVED_DATE_LIST_ID = "SAVED_DATE_LIST_ID";

// Convert error object to string
function toErrorString(error: unknown): string {
  return error instanceof Error ? error.name : String(error);
}

// The SavedDate data come from localStorage (not API)
// - so we use fakeBaseQuery and queryFn
export const savedDataSlice = createApi({
  reducerPath: "savedDataSlice",
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: [SAVED_DATE_TAG],
  endpoints: (builder) => ({
    getSavedData: builder.query<SavedDate[], void>({
      queryFn: () => {
        try {
          return { data: getSavedData() };
        } catch (error) {
          console.error(error);
          return { error: toErrorString(error) };
        }
      },
      // One tag per record plus the list tag
      providesTags: (result) => [
        ...(result ?? []).map(
          (_, index) => ({ type: SAVED_DATE_TAG, id: index }) as const
        ),
        { type: SAVED_DATE_TAG, id: SAVED_DATE_LIST_ID },
      ],
    }),

    saveBaseDate: builder.mutation<
      void,
      { index: number; baseDate: SavedDate }
    >({
      queryFn: ({ index, baseDate }) => {
        try {
          setBaseDateJson(index, baseDate);
          return { data: undefined };
        } catch (error) {
          console.error(error);
          return { error: toErrorString(error) };
        }
      },
      // Invalidate the edited record and the list
      invalidatesTags: (_result, _error, { index }) => [
        { type: SAVED_DATE_TAG, id: index },
        { type: SAVED_DATE_TAG, id: SAVED_DATE_LIST_ID },
      ],
    }),

    deleteBaseDate: builder.mutation<void, number>({
      queryFn: (index) => {
        try {
          deleteBaseDate(index);
          return { data: undefined };
        } catch (error) {
          console.error(error);
          return { error: toErrorString(error) };
        }
      },
      // Invalidate the whole record type (details + list)
      // (currently, the record indexes in localStorage are shifted on delete)
      invalidatesTags: [SAVED_DATE_TAG],
    }),
  }),
});

export const {
  useGetSavedDataQuery,
  useSaveBaseDateMutation,
  useDeleteBaseDateMutation,
} = savedDataSlice;
