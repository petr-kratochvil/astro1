import { describe, it, expect } from "vitest";
import { getAspects } from "./aspects";

describe("getAspects", () => {
  it("finds a conjunction within orb", () => {
    const chart1 = [{ sign: "Aries" as const, degrees: 5 }];
    const chart2 = [{ sign: "Aries" as const, degrees: 10 }];
    const aspects = getAspects(chart1, chart2);
    expect(aspects).toHaveLength(1);
    const [aspect] = aspects;
    expect(aspect!.name).toBe("conjunction");
    expect(aspect!.orb).toBeCloseTo(5);
  });

  it("finds an opposition within orb", () => {
    const chart1 = [{ sign: "Aries" as const, degrees: 0 }];
    const chart2 = [{ sign: "Libra" as const, degrees: 2 }];
    const aspects = getAspects(chart1, chart2);
    expect(aspects).toHaveLength(1);
    const [aspect] = aspects;
    expect(aspect!.name).toBe("opposition");
    expect(aspect!.orb).toBeCloseTo(2);
  });

  it("returns nothing when positions are out of every orb", () => {
    const chart1 = [{ sign: "Aries" as const, degrees: 0 }];
    const chart2 = [{ sign: "Taurus" as const, degrees: 15 }];
    expect(getAspects(chart1, chart2)).toEqual([]);
  });

  it("accounts for minutes and seconds", () => {
    const chart1 = [
      { sign: "Aries" as const, degrees: 0, minutes: 0, seconds: 0 },
    ];
    const chart2 = [
      { sign: "Aries" as const, degrees: 0, minutes: 30, seconds: 0 },
    ];
    const aspects = getAspects(chart1, chart2);
    expect(aspects[0]!.orb).toBeCloseTo(0.5);
  });
});
