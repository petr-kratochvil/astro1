import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { ephemeridesApiBase } from "src/constants";

// Tag type - saved date records
export const SAVED_DATE_TAG = "SAVED_DATE_TAG";
// Tag ID for the list
export const SAVED_DATE_LIST_ID = "SAVED_DATE_LIST_ID";

// Tag for a single record, identified by its index in the saved data.
// Coercion to string: RTK Query currently regards numeric index 0 as without ID
// TODO: fill issue to reduxjs/redux-toolkit
export function savedDateTag(index: number) {
  return { type: SAVED_DATE_TAG, id: String(index) } as const;
}

// Convert error object to a FetchBaseQueryError, so that endpoints using
// queryFn can report failures in the same shape as the HTTP ones.
export function isFetchBaseQueryError(e: unknown): e is FetchBaseQueryError {
  return typeof e === "object" && e !== null && "status" in e;
}

export function toFetchError(error: unknown): FetchBaseQueryError {
  if (isFetchBaseQueryError(error)) return error;
  return {
    status: "CUSTOM_ERROR",
    error: error instanceof Error ? error.name : String(error),
  };
}

// A single API slice for the whole app, to enable sharing tags between "slices"
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: ephemeridesApiBase }),
  tagTypes: [SAVED_DATE_TAG],
  endpoints: () => ({}),
});
