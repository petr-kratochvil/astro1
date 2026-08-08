import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { fromUTC } from "./timeZones";
import { JsonDate } from "../types";

describe("fromUTC", () => {
  it("returns undefined when no date is given", () => {
    expect(fromUTC(undefined)).toBeUndefined();
  });

  it("converts a whole-hour JsonDate to a UTC Date", () => {
    const baseDate: JsonDate = { year: 2024, month: 3, day: 15, hour: 12 };
    const result = fromUTC(baseDate);
    expect(result?.toISOString()).toBe("2024-03-15T12:00:00.000Z");
  });

  it("splits a fractional hour into minutes", () => {
    const baseDate: JsonDate = { year: 2024, month: 1, day: 1, hour: 9.5 };
    const result = fromUTC(baseDate);
    expect(result?.toISOString()).toBe("2024-01-01T09:30:00.000Z");
  });

  it.each(["year", "month", "day", "hour"] as const)(
    "returns undefined when %s is NaN",
    (field) => {
      const baseDate: JsonDate = { year: 2024, month: 1, day: 1, hour: 0 };
      expect(fromUTC({ ...baseDate, [field]: NaN })).toBeUndefined();
    }
  );

  describe("minute rounding", () => {
    it("rounds to the nearest minute, discarding seconds", () => {
      // 12.508333h is 12:30:30
      const baseDate: JsonDate = {
        year: 2024,
        month: 1,
        day: 1,
        hour: 12.508333,
      };
      expect(fromUTC(baseDate)?.toISOString()).toBe("2024-01-01T12:30:00.000Z");
    });

    it("carries into the next day when the minutes round up to 60", () => {
      const baseDate: JsonDate = { year: 2024, month: 1, day: 1, hour: 23.999 };
      expect(fromUTC(baseDate)?.toISOString()).toBe("2024-01-02T00:00:00.000Z");
    });
  });

  describe("years under 100", () => {
    it("does not map them onto the 20th century", () => {
      const baseDate: JsonDate = { year: 50, month: 1, day: 1, hour: 0 };
      expect(fromUTC(baseDate)?.getUTCFullYear()).toBe(50);
    });

    it("leaves years from 100 onwards untouched", () => {
      const baseDate: JsonDate = { year: 100, month: 1, day: 1, hour: 0 };
      expect(fromUTC(baseDate)?.getUTCFullYear()).toBe(100);
    });

    it("handles a historical year before 1900", () => {
      const baseDate: JsonDate = { year: 1582, month: 10, day: 15, hour: 12 };
      expect(fromUTC(baseDate)?.toISOString()).toBe("1582-10-15T12:00:00.000Z");
    });
  });

  describe("in a non-UTC timezone", () => {
    beforeAll(() => {
      vi.stubEnv("TZ", "Asia/Tokyo"); // UTC+9, no DST
    });

    afterAll(() => {
      vi.unstubAllEnvs();
    });

    it("interprets the fields as UTC, not as local time", () => {
      const baseDate: JsonDate = { year: 2024, month: 3, day: 15, hour: 12 };
      expect(fromUTC(baseDate)?.toISOString()).toBe("2024-03-15T12:00:00.000Z");
    });

    it("renders in local time, shifting across the date boundary", () => {
      // SavedDataList and SetBaseDate read the result with local getters
      const baseDate: JsonDate = { year: 2024, month: 3, day: 15, hour: 20 };
      const result = fromUTC(baseDate);
      expect(result?.getHours()).toBe(5);
      expect(result?.getDate()).toBe(16);
    });
  });
});
