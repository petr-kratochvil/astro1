import { describe, it, expect } from "vitest";
import { formatDateWithWeekday } from "./formatting";
import { getLocale } from "./language";

// Saturday 8 August 2026, UTC
const saturday = new Date(Date.UTC(2026, 7, 8, 12));

describe("formatDateWithWeekday", () => {
  it("keeps the Czech day-first numeric form", () => {
    expect(formatDateWithWeekday(saturday, getLocale("cs"))).toBe(
      "So, 8. 8. 2026"
    );
  });

  it("uses the British day-month-year form in English", () => {
    expect(formatDateWithWeekday(saturday, getLocale("en"))).toBe(
      "Sat, 8 Aug 2026"
    );
  });

  it("reads the date in UTC, so the weekday matches the date shown", () => {
    // 23:30 UTC is already the next day in Prague, but both parts stay on the 8th
    const lateEvening = new Date(Date.UTC(2026, 7, 8, 23, 30));
    expect(formatDateWithWeekday(lateEvening, getLocale("cs"))).toBe(
      "So, 8. 8. 2026"
    );
  });

  it("falls back to the default locale for an unknown language", () => {
    expect(formatDateWithWeekday(saturday, getLocale("not.a.locale"))).toBe(
      "Sat, 8 Aug 2026"
    );
  });
});
