import { describe, it, expect } from "vitest";
import {
  formatDateTimeWithWeekday,
  formatDateWithWeekday,
  formatTimeOfDay,
} from "./formatting";
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

describe("formatTimeOfDay", () => {
  // 07:11 UTC, the kind of time a station comes back with
  const morning = new Date(Date.UTC(2026, 9, 24, 7, 11));

  it("reads the time in UTC when asked to", () => {
    expect(formatTimeOfDay(morning, getLocale("cs"), "UTC")).toBe("7:11");
    expect(formatTimeOfDay(morning, getLocale("en"), "UTC")).toBe("07:11");
  });

  it("defaults to UTC, like formatDateWithWeekday", () => {
    expect(formatTimeOfDay(morning, getLocale("en"))).toBe(
      formatTimeOfDay(morning, getLocale("en"), "UTC")
    );
  });

  // Date's own getters are the independent oracle here, so that the expectation
  // holds in whichever zone the test run happens to be in
  it("reads the time off the reader's own clock when asked for local time", () => {
    const hours = String(morning.getHours()).padStart(2, "0");
    const minutes = String(morning.getMinutes()).padStart(2, "0");
    expect(formatTimeOfDay(morning, getLocale("en"), "local")).toBe(
      `${hours}:${minutes}`
    );
  });

  // en-US is not one of the app's languages, but it is the locale that would
  // bring AM/PM along if the hour cycle were left to the locale
  it("sticks to the 24 hour clock even where the locale would not", () => {
    const afternoon = new Date(Date.UTC(2026, 10, 13, 15, 53));
    expect(formatTimeOfDay(afternoon, "en-US", "UTC")).toBe("15:53");
  });

  it("writes midnight as 00:00 rather than 24:00", () => {
    const midnight = new Date(Date.UTC(2026, 10, 13, 0, 0));
    expect(formatTimeOfDay(midnight, getLocale("en"), "UTC")).toBe("00:00");
  });
});

describe("formatDateTimeWithWeekday", () => {
  const afternoon = new Date(Date.UTC(2026, 10, 13, 16, 53));

  it("puts the time after the date, each in the form its locale uses", () => {
    expect(formatDateTimeWithWeekday(afternoon, getLocale("en"), "UTC")).toBe(
      "Fri, 13 Nov 2026, 16:53"
    );
    expect(formatDateTimeWithWeekday(afternoon, getLocale("cs"), "UTC")).toBe(
      "Pá, 13. 11. 2026, 16:53"
    );
  });

  it("reads both halves off the same clock", () => {
    // 23:30 UTC is already the next day east of Greenwich, so the date shown has
    // to move along with the time rather than staying on the UTC day
    const lateEvening = new Date(Date.UTC(2026, 9, 24, 23, 30));
    const local = formatDateTimeWithWeekday(
      lateEvening,
      getLocale("en"),
      "local"
    );
    expect(local).toContain(String(lateEvening.getDate()));
    expect(local).toContain(String(lateEvening.getHours()).padStart(2, "0"));
  });
});

describe("formatDateWithWeekday in local time", () => {
  // 23:30 UTC on a Saturday - already Sunday the 25th east of Greenwich
  const lateEvening = new Date(Date.UTC(2026, 9, 24, 23, 30));

  it("shows the day the reader's own clock is on", () => {
    const day = lateEvening.getDate();
    expect(
      formatDateWithWeekday(lateEvening, getLocale("en"), "local")
    ).toContain(String(day));
  });
});
