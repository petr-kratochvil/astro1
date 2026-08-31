import { SavedDate } from "src/types";
import {
  deleteBaseDate,
  getBaseDateJson,
  getSavedData,
  setBaseDateJson,
} from "src/utils/localStorage";
import {
  apiSlice,
  savedDateTag,
  SAVED_DATE_LIST_ID,
  SAVED_DATE_TAG,
  toFetchError,
} from "src/store/slices/apiSlice";

// Placeholder name for quick unnamed records, derived from the actual store contents
const AUTO_NAME_PATTERN = /^\[Datum (\d+)\]$/;

export function nextAutoName(records: SavedDate[]): string {
  const highest = records.reduce((max, record) => {
    const match = AUTO_NAME_PATTERN.exec(record.name ?? "");
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `[Datum ${highest + 1}]`;
}

// The SavedDate data come from localStorage (not API)
// - so we use queryFn instead of the slice base query
export const savedDataSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSavedData: builder.query<SavedDate[], void>({
      queryFn: () => {
        try {
          return { data: getSavedData() };
        } catch (error) {
          console.error(error);
          return { error: toFetchError(error) };
        }
      },
      // One tag per record plus the list tag
      providesTags: (result) => [
        ...(result ?? []).map((_, index) => savedDateTag(index)),
        { type: SAVED_DATE_TAG, id: SAVED_DATE_LIST_ID },
      ],
    }),

    getSavedDataDetail: builder.query<SavedDate | undefined, number>({
      queryFn: (index) => {
        try {
          return { data: getBaseDateJson(index) };
        } catch (error) {
          console.error(error);
          return { error: toFetchError(error) };
        }
      },
      // One tag per record plus the list tag
      providesTags: (_result, _error, arg) => [
        savedDateTag(arg),
        { type: SAVED_DATE_TAG, id: SAVED_DATE_LIST_ID },
      ],
    }),

    saveBaseDate: builder.mutation<
      void,
      { index: number; baseDate: SavedDate }
    >({
      queryFn: ({ index, baseDate }) => {
        try {
          // Automatic naming of unnamed records
          const named = baseDate.name
            ? baseDate
            : { ...baseDate, name: nextAutoName(getSavedData()) };
          setBaseDateJson(index, named);
          return { data: undefined };
        } catch (error) {
          console.error(error);
          return { error: toFetchError(error) };
        }
      },
      // Invalidate the edited record and the list.
      // The record tag also reaches the ephemerides queries computed from it.
      invalidatesTags: (_result, _error, { index }) => [
        savedDateTag(index),
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
          return { error: toFetchError(error) };
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
  useGetSavedDataDetailQuery,
  useSaveBaseDateMutation,
  useDeleteBaseDateMutation,
} = savedDataSlice;
