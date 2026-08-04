import { JsonDate } from "../types";

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
    return new Date(baseDateTimestamp);
  }
  return undefined;
}
