import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { createAppStore } from "src/store";
import { useAppDispatch } from "src/store/hooks";
import {
  ephemeridesSlice,
  useGetPositionQuery,
} from "src/store/slices/ephemeridesSlice";
import { JsonDate } from "src/types";
import { dateToApiUTC, jsonDateCode } from "src/utils/timeZones";
import { useStreamingQuery } from "./useStreamingQuery";

// Every request is held until the test resolves it, so that responses can be
// made to arrive in a different order than they were requested
const pendingResponses: Array<(response: Response) => void> = [];

function resolveRequest(requestIndex: number, response: Response) {
  const respond = pendingResponses[requestIndex];
  if (!respond) {
    throw new Error(`Request ${requestIndex} has not been sent`);
  }
  respond(response);
}

function respondTo(requestIndex: number, body: unknown) {
  resolveRequest(
    requestIndex,
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  );
}

function failRequest(requestIndex: number) {
  resolveRequest(requestIndex, new Response("", { status: 500 }));
}

function positionsNamed(name: string) {
  return [{ type: "body", bodyId: 0, name, position: 1 }];
}

// The streaming is endpoint agnostic, `getPosition` is the simplest one to drive
function useStreamingPositionUnderTest(timestamp: number) {
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

  const arg = React.useMemo(
    () => dateToApiUTC(new Date(timestamp)),
    [timestamp]
  );
  const prefetchArgs = React.useMemo<JsonDate[]>(() => [], []);

  return useStreamingQuery({
    useQuery: useGetPositionQuery,
    fetchToCache,
    arg,
    argCode: jsonDateCode,
    prefetchArgs,
  });
}

function renderStreamingQuery(timestamp: number) {
  const store = createAppStore();
  return renderHook(
    ({ timestamp }: { timestamp: number }) =>
      useStreamingPositionUnderTest(timestamp),
    {
      initialProps: { timestamp },
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    }
  );
}

const DAY_1 = new Date(2024, 2, 15, 12).getTime();
const DAY_2 = new Date(2024, 2, 16, 12).getTime();
const DAY_3 = new Date(2024, 2, 17, 12).getTime();

beforeEach(() => {
  pendingResponses.length = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(
      () =>
        new Promise((resolve) => {
          pendingResponses.push(resolve);
        })
    )
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  cleanup();
});

describe("useStreamingQuery", () => {
  it("shows the data once the requested response arrives", async () => {
    const { result } = renderStreamingQuery(DAY_1);

    await waitFor(() => expect(pendingResponses).toHaveLength(1));
    expect(result.current.isCatchingUp).toBe(true);

    respondTo(0, positionsNamed("day 1"));

    await waitFor(() => expect(result.current.isCatchingUp).toBe(false));
    expect(result.current.data).toEqual(positionsNamed("day 1"));
  });

  it("keeps showing the previous data while the next request is in flight", async () => {
    const { result, rerender } = renderStreamingQuery(DAY_1);

    await waitFor(() => expect(pendingResponses).toHaveLength(1));
    respondTo(0, positionsNamed("day 1"));
    await waitFor(() => expect(result.current.isCatchingUp).toBe(false));

    rerender({ timestamp: DAY_2 });

    await waitFor(() => expect(pendingResponses).toHaveLength(2));
    // The day 2 response has not arrived yet - day 1 stays on the screen
    expect(result.current.isCatchingUp).toBe(true);
    expect(result.current.data).toEqual(positionsNamed("day 1"));

    respondTo(1, positionsNamed("day 2"));

    await waitFor(() => expect(result.current.isCatchingUp).toBe(false));
    expect(result.current.data).toEqual(positionsNamed("day 2"));
  });

  it("does not let a late response overwrite a newer one", async () => {
    const { result, rerender } = renderStreamingQuery(DAY_1);

    await waitFor(() => expect(pendingResponses).toHaveLength(1));
    rerender({ timestamp: DAY_2 });
    await waitFor(() => expect(pendingResponses).toHaveLength(2));
    rerender({ timestamp: DAY_3 });
    await waitFor(() => expect(pendingResponses).toHaveLength(3));

    // The newest request is answered first, the older ones only afterwards
    respondTo(2, positionsNamed("day 3"));
    await waitFor(() => expect(result.current.isCatchingUp).toBe(false));
    expect(result.current.data).toEqual(positionsNamed("day 3"));

    respondTo(1, positionsNamed("day 2"));
    respondTo(0, positionsNamed("day 1"));

    await waitFor(() => expect(pendingResponses).toHaveLength(3));
    expect(result.current.data).toEqual(positionsNamed("day 3"));
    expect(result.current.isCatchingUp).toBe(false);
  });

  it("advances to the displayed data even when a request fails", async () => {
    const { result } = renderStreamingQuery(DAY_1);

    await waitFor(() => expect(pendingResponses).toHaveLength(1));
    failRequest(0);

    // The failed request still counts as arrived, so the page stops waiting
    // (the subscription of the displayed argument then retries on its own)
    await waitFor(() => expect(result.current.isCatchingUp).toBe(false));
  });
});
