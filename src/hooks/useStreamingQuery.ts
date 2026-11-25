import React from "react";
import { skipToken, TypedUseQuery } from "@reduxjs/toolkit/query/react";
import { AppBaseQuery } from "src/store/slices/apiSlice";
import { useBusy } from "./useBusy";
import { useIsMounted } from "./useIsMounted";

// Data for the requested argument, with continuous updates in case the user
// changes the argument fast (by clicking, swiping or using arrow keys).
//
// Requested and displayed argument are separated: If there are multiple mid-flight
// requests, the displayed one advances when a response arrives
// (while keeping the order, using requestCounter, so a late response doesn't overwrite newer one)
//
// The requested argument (what the buttons move) is fetched with `subscribe: false`,
// which fills the cache without making the view depend on it.
// The subscribed query reads the displayed argument (which is already in the cache)
//
// Requests are never aborted, they can be used from cache when the user goes back

const PREFETCH_DELAY_MS = 300;

export function useStreamingQuery<Arg, Data>({
  useQuery,
  fetchToCache,
  arg,
  argCode,
  prefetchArgs,
  skip = false,
}: {
  // The endpoint to read: its hook and a cache-filling dispatch of the same endpoint
  useQuery: TypedUseQuery<Data, Arg, AppBaseQuery>;
  fetchToCache: (arg: Arg) => Promise<unknown>;
  arg: Arg;
  // Identity of an argument, to tell the requested and the displayed one apart
  argCode: (arg: Arg) => string;
  // What to fetch in advance once the requested argument is displayed
  prefetchArgs: Arg[];
  skip?: boolean;
}) {
  const isMounted = useIsMounted();
  const requestCounter = React.useRef(0);
  const lastArrivedRequestId = React.useRef(0);

  // the newest fulfilled request
  const [displayed, setDisplayed] = React.useState<Arg | undefined>();

  React.useEffect(() => {
    if (skip) {
      return;
    }
    // new sequence number for new requested argument
    const lastRequestId = ++requestCounter.current;

    const requestArrived = () => {
      // if newer data have already arrived, don't overwrite them
      if (!isMounted() || lastRequestId <= lastArrivedRequestId.current) {
        return;
      }
      lastArrivedRequestId.current = lastRequestId;
      // `setDisplayed` triggers a re-render (RTK subscription will be served from the cache)
      setDisplayed(arg);
    };

    fetchToCache(arg)
      // on error, we still must regard the request as arrived (it advances the component subscription)
      .catch(() => {})
      .finally(requestArrived);
  }, [isMounted, skip, arg, fetchToCache]);

  const result = useQuery(displayed ?? skipToken);
  const isCatchingUp =
    !skip && (!displayed || argCode(displayed) !== argCode(arg));

  useBusy(isCatchingUp);

  // Prefetch of the neighbouring arguments
  React.useEffect(() => {
    if (skip || isCatchingUp) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      prefetchArgs.forEach((prefetchArg) => {
        fetchToCache(prefetchArg).catch(() => {});
      });
    }, PREFETCH_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [skip, isCatchingUp, prefetchArgs, fetchToCache]);

  return { ...result, isCatchingUp };
}
