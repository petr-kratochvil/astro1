import { describe, it, expect } from "vitest";
import { nextAutoName } from "./savedDataSlice";
import { SavedDate } from "src/types";

const named = (name: string): SavedDate => ({
  name,
  year: 2024,
  month: 1,
  day: 1,
  hour: 0,
  customCoordinates: false,
  lat: 50.075,
  lon: 14.437,
});

describe("nextAutoName", () => {
  it("starts at 1 for an empty list", () => {
    expect(nextAutoName([])).toBe("[Datum 1]");
  });

  it("ignores records the user named", () => {
    expect(nextAutoName([named("Alice"), named("Bob")])).toBe("[Datum 1]");
  });

  it("continues from the highest existing number", () => {
    expect(nextAutoName([named("[Datum 1]"), named("[Datum 2]")])).toBe(
      "[Datum 3]"
    );
  });

  it("uses the highest number, not the count, so deletions cannot collide", () => {
    // [Datum 1] was deleted - reusing 2 would duplicate the surviving record
    expect(nextAutoName([named("[Datum 2]")])).toBe("[Datum 3]");
  });

  it("is not confused by names that merely resemble the pattern", () => {
    expect(nextAutoName([named("[Datum 12x]"), named("Datum 9")])).toBe(
      "[Datum 1]"
    );
  });
});
