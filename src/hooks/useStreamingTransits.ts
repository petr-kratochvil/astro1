import React from "react";
import { useAppDispatch } from "src/store/hooks";
import {
  ephemeridesSlice,
  useGetTransitsQuery,
} from "src/store/slices/ephemeridesSlice";
import { dateAddDays, dateToApiUTC, jsonDateCode } from "src/utils/timeZones";
import { JsonDate } from "src/types";
import { useStreamingQuery } from "./useStreamingQuery";

// Transits for the requested day and base record, streamed as the user
// switches days - see useStreamingQuery for how the streaming works.

type TransitsRequest = { index: number; transitDate: JsonDate };

const transitsRequestCode = ({ index, transitDate }: TransitsRequest) =>
  `${index}:${jsonDateCode(transitDate)}`;

export function useStreamingTransits({
  baseDateIndex,
  transitTimestamp,
  skip = false,
}: {
  baseDateIndex: number;
  transitTimestamp: number;
  skip?: boolean;
}) {
  const dispatch = useAppDispatch();

  const fetchToCache = React.useCallback(
    (request: TransitsRequest) =>
      dispatch(
        ephemeridesSlice.endpoints.getTransits.initiate(request, {
          subscribe: false,
        })
      ).unwrap(),
    [dispatch]
  );

  const arg = React.useMemo(
    () => ({
      index: baseDateIndex,
      transitDate: dateToApiUTC(new Date(transitTimestamp)),
    }),
    [baseDateIndex, transitTimestamp]
  );

  const prefetchArgs = React.useMemo(
    () =>
      [+1, -1].map((days) => ({
        index: baseDateIndex,
        transitDate: dateToApiUTC(
          dateAddDays(new Date(transitTimestamp), days)
        ),
      })),
    [baseDateIndex, transitTimestamp]
  );

  return useStreamingQuery({
    useQuery: useGetTransitsQuery,
    fetchToCache,
    arg,
    argCode: transitsRequestCode,
    prefetchArgs,
    skip,
  });
}
