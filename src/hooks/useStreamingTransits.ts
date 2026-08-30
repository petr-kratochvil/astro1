import React from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useAppDispatch } from "src/store/hooks";
import {
  ephemeridesSlice,
  useGetTransitsQuery,
} from "src/store/slices/ephemeridesSlice";
import { dateAddDays, dateToApiUTC } from "src/utils/timeZones";
import { JsonDate } from "src/types";

// Transits for the requested day, with continuous updates in case the user switches
// days fast (by clicking, swiping or using arrow keys).
//
// Requested and displayed date are separated: If there are multiple mid-flight requests,
// the displayed date advances when a response arrives
// (while keeping the order, using requestCounter, so a late response doesn't overwrite newer one)
//
// The requested day (what the buttons move) is fetched with `subscribe: false`,
// which fills the cache without making the view depend on it.
// The subscribed query reads the displayed day (which is already in the cache)
//
// Requests are never aborted, they can be used from cache when the user goes back the same days

// How long to wait after the view has caught up (settled on a date) before prefetching the neighbouring
// days. (not to compete with other requests)
const PREFETCH_DELAY_MS = 300;

type TransitsRequest = { index: number; transitDate: JsonDate };

const transitsRequestCode = ({ index, transitDate }: TransitsRequest) =>
  `${index}:${transitDate.year}:${transitDate.month}:${transitDate.day}:${transitDate.hour}`;

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
  const prefetchTransits = ephemeridesSlice.usePrefetch("getTransits");

  const isMounted = React.useRef(true);
  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const requestCounter = React.useRef(0);
  const lastArrivedRequestId = React.useRef(0);

  const requested: TransitsRequest = React.useMemo(
    () => ({
      index: baseDateIndex,
      transitDate: dateToApiUTC(new Date(transitTimestamp)),
    }),
    [baseDateIndex, transitTimestamp]
  );

  const [displayed, setDisplayed] = React.useState<
    TransitsRequest | undefined
  >();

  // Create new data request
  React.useEffect(() => {
    if (skip) {
      return;
    }
    // new sequence number for new requested date
    const lastRequestId = ++requestCounter.current;

    const runningRequest = dispatch(
      ephemeridesSlice.endpoints.getTransits.initiate(requested, {
        subscribe: false,
      })
    );

    const requestArrived = () => {
      // if newer data have already arrived, don't overwrite them
      if (!isMounted.current || lastRequestId <= lastArrivedRequestId.current) {
        return;
      }
      lastArrivedRequestId.current = lastRequestId;
      // `setDisplayed` triggers a re-render (RTK subscription will be served from the cache)
      setDisplayed(requested);
    };

    runningRequest
      .unwrap()
      // on error, we still must regard the request as arrived (it advances the component subscription)
      .catch(() => {})
      .finally(requestArrived);
  }, [dispatch, skip, requested]);

  const result = useGetTransitsQuery(displayed ?? skipToken);
  const isCatchingUp =
    !skip &&
    (!displayed ||
      transitsRequestCode(displayed) !== transitsRequestCode(requested));

  // Prefetch of the neighbouring days
  React.useEffect(() => {
    if (skip || isCatchingUp) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      const date = new Date(transitTimestamp);
      prefetchTransits({
        index: baseDateIndex,
        transitDate: dateToApiUTC(dateAddDays(date, +1)),
      });
      prefetchTransits({
        index: baseDateIndex,
        transitDate: dateToApiUTC(dateAddDays(date, -1)),
      });
    }, PREFETCH_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [skip, isCatchingUp, baseDateIndex, transitTimestamp, prefetchTransits]);

  return { ...result, isCatchingUp };
}
