import { describe, it, expect, afterEach, vi } from "vitest";
import { detectBrowserLanguage, isLanguage } from "./language";

function mockNavigatorLanguages(languages: string[]) {
  vi.spyOn(navigator, "languages", "get").mockReturnValue(languages);
  vi.spyOn(navigator, "language", "get").mockReturnValue(languages[0] ?? "");
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("isLanguage", () => {
  it("accepts the supported codes", () => {
    expect(isLanguage("cs")).toBe(true);
    expect(isLanguage("en")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isLanguage("de")).toBe(false);
    expect(isLanguage(undefined)).toBe(false);
    expect(isLanguage(42)).toBe(false);
  });
});

describe("detectBrowserLanguage", () => {
  it("returns cs when Czech is the preferred language", () => {
    mockNavigatorLanguages(["cs-CZ", "en-US"]);
    expect(detectBrowserLanguage()).toBe("cs");
  });

  it("returns cs when Czech appears further down the list", () => {
    mockNavigatorLanguages(["sk-SK", "en-US", "cs"]);
    expect(detectBrowserLanguage()).toBe("cs");
  });

  it("returns en when Czech is not supported", () => {
    mockNavigatorLanguages(["de-DE", "en-GB"]);
    expect(detectBrowserLanguage()).toBe("en");
  });

  it("falls back to navigator.language when the list is empty", () => {
    mockNavigatorLanguages([]);
    vi.spyOn(navigator, "language", "get").mockReturnValue("cs-CZ");
    expect(detectBrowserLanguage()).toBe("cs");
  });
});
