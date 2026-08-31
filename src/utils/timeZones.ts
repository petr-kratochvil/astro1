import { JsonDate } from "src/types";

// Use minute granularity for the API, so the result is stable in the RTK cache
export function dateToApiUTC(date: Date): JsonDate {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours() + date.getUTCMinutes() / 60,
  };
}

export function apiUTCToDate(baseDateJson?: JsonDate): Date | undefined {
  if (!baseDateJson) {
    return undefined;
  }
  const baseDateTimestamp = Date.UTC(
    baseDateJson.year,
    baseDateJson.month - 1,
    baseDateJson.day,
    Math.floor(baseDateJson.hour),
    Math.round((baseDateJson.hour - Math.floor(baseDateJson.hour)) * 60)
  );
  if (!isNaN(baseDateTimestamp)) {
    const baseDate = new Date(baseDateTimestamp);
    // Date.UTC maps years 0-99 onto 1900-1999
    // Keep any month/day overflow that Date.UTC already made
    if (baseDateJson.year >= 0 && baseDateJson.year < 100) {
      baseDate.setUTCFullYear(baseDate.getUTCFullYear() - 1900);
    }
    return baseDate;
  }
  return undefined;
}

export function dateAddDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function dateAddMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}
