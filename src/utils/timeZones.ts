import { JsonDate } from "src/types";

export function fromUTC(baseDateJson?: JsonDate): Date | undefined {
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
