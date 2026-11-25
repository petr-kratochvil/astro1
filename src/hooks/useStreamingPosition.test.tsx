import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { createAppStore } from "src/store";
import { useStreamingPosition } from "./useStreamingPosition";

const requestedBodies: unknown[] = [];

function positions() {
  return [{ type: "body", bodyId: 0, name: "Sun", position: 1 }];
}

function renderStreamingPosition(timestamp: number) {
  const store = createAppStore();
  return renderHook(
    ({ timestamp }: { timestamp: number }) =>
      useStreamingPosition({ timestamp }),
    {
      initialProps: { timestamp },
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    }
  );
}

beforeEach(() => {
  requestedBodies.length = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (request: Request) => {
      requestedBodies.push(await request.json());
      return new Response(JSON.stringify(positions()), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    })
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  cleanup();
});

describe("useStreamingPosition", () => {
  it("asks for the positions at the given moment, in UTC", async () => {
    // 15 Mar 2024, 13:30 in Europe/Prague (the time zone the suite runs in)
    const { result } = renderStreamingPosition(
      new Date(2024, 2, 15, 13, 30).getTime()
    );

    await waitFor(() => expect(result.current.isCatchingUp).toBe(false));

    expect(requestedBodies[0]).toEqual({
      year: 2024,
      month: 3,
      day: 15,
      hour: 12.5,
    });
    expect(result.current.data).toEqual(positions());
  });

  it("prefetches the neighbouring days", async () => {
    const { result } = renderStreamingPosition(
      new Date(2024, 2, 15, 13, 30).getTime()
    );

    await waitFor(() => expect(result.current.isCatchingUp).toBe(false));
    await waitFor(() => expect(requestedBodies).toHaveLength(3));

    expect(requestedBodies.slice(1)).toEqual([
      { year: 2024, month: 3, day: 16, hour: 12.5 },
      { year: 2024, month: 3, day: 14, hour: 12.5 },
    ]);
  });

  it("sends no request while skipped", async () => {
    const store = createAppStore();
    renderHook(
      () =>
        useStreamingPosition({
          timestamp: new Date(2024, 2, 15, 13, 30).getTime(),
          skip: true,
        }),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(requestedBodies).toHaveLength(0);
  });
});
