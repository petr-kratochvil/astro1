import { describe, it, expect, beforeEach } from "vitest";
import i18n from "../i18n";
import {
  translateAspectName,
  translateCelestialObject,
  translateSignName,
} from "./translations";

const t = () => i18n.t.bind(i18n);

beforeEach(async () => {
  await i18n.changeLanguage("cs");
});

describe("translateCelestialObject", () => {
  it("translates the bodies that have a Czech name", () => {
    expect(translateCelestialObject({ name: "Sun" }, t())).toBe("Slunce");
  });

  it("falls back to the API name when no translation exists", () => {
    // Mars/Jupiter are spelled the same in Czech, so they carry no entry
    expect(translateCelestialObject({ name: "Jupiter" }, t())).toBe("Jupiter");
  });

  it("returns the English name once the language changes", async () => {
    await i18n.changeLanguage("en");
    expect(translateCelestialObject({ name: "Sun" }, t())).toBe("Sun");
  });

  it("interpolates the house number in both languages", async () => {
    const house = { name: "house", type: "house" as const, houseNumber: 3 };
    expect(translateCelestialObject(house, t())).toBe("3. dům");
    await i18n.changeLanguage("en");
    expect(translateCelestialObject(house, t())).toBe("House 3");
  });
});

describe("translateSignName", () => {
  it("translates a sign to Czech", () => {
    expect(translateSignName("Capricorn", t())).toBe("Kozoroh");
  });

  it("keeps the English name in English", async () => {
    await i18n.changeLanguage("en");
    expect(translateSignName("Capricorn", t())).toBe("Capricorn");
  });
});

describe("translateAspectName", () => {
  it("returns a language-independent glyph", async () => {
    expect(translateAspectName("trine")).toBe("💙");
    await i18n.changeLanguage("en");
    expect(translateAspectName("trine")).toBe("💙");
  });
});
