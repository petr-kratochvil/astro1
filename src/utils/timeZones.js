export function fromUTC(baseDateJson) {
  if (!baseDateJson) {
    return undefined;
  }
  const baseDateTimestamp = Date.UTC(
    parseInt(baseDateJson.year),
    parseInt(baseDateJson.month) - 1,
    parseInt(baseDateJson.day),
    Math.floor(parseFloat(baseDateJson.hour)),
    Math.round((parseFloat(baseDateJson.hour) -
      Math.floor(parseFloat(baseDateJson.hour))) *
      60)
  );
  if (!isNaN(baseDateTimestamp)) {
    return new Date(baseDateTimestamp);
  }
  return undefined;
}