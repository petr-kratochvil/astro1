import React from "react";
import { useAppDispatch } from "src/store/hooks";
import {
  ephemeridesSlice,
  useGetPositionQuery,
} from "src/store/slices/ephemeridesSlice";
import { dateAddDays, dateToApiUTC, jsonDateCode } from "src/utils/timeZones";
import { JsonDate } from "src/types";
import { useStreamingQuery } from "./useStreamingQuery";

// Planet positions for the requested moment, streamed as the user switches
// days - see useStreamingQuery for how the streaming works.

export function useStreamingPosition({
  timestamp,
  skip = false,
}: {
  timestamp: number;
  skip?: boolean;
}) {
  const dispatch = useAppDispatch();

  const fetchToCache = React.useCallback(
    (jsonDate: JsonDate) =>
      dispatch(
        ephemeridesSlice.endpoints.getPosition.initiate(jsonDate, {
          subscribe: false,
        })
      ).unwrap(),
    [dispatch]
  );

  // dateToApiUTC truncates to a minute granularity, so the cache key does not
  // change every render
  const arg = React.useMemo(
    () => dateToApiUTC(new Date(timestamp)),
    [timestamp]
  );

  const prefetchArgs = React.useMemo(
    () =>
      [+1, -1].map((days) =>
        dateToApiUTC(dateAddDays(new Date(timestamp), days))
      ),
    [timestamp]
  );

  return useStreamingQuery({
    useQuery: useGetPositionQuery,
    fetchToCache,
    arg,
    argCode: jsonDateCode,
    prefetchArgs,
    skip,
  });
}
