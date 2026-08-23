import { describe, it, expect, beforeEach } from "vitest";
import {
  getUserObject,
  setUserObject,
  getSavedData,
  setBaseDateJson,
  getBaseDateJson,
  deleteBaseDate,
  getLanguage,
  setLanguage,
} from "./localStorage";
import { SavedDate } from "../types";

const makeSavedDate = (name: string): SavedDate => ({
  name,
  year: 2024,
  month: 1,
  day: 1,
  hour: 0,
  customCoordinates: false,
  lat: 50.075,
  lon: 14.437,
});

beforeEach(() => {
  localStorage.clear();
});

describe("getUserObject / setUserObject", () => {
  it("returns an empty object when nothing is stored", () => {
    expect(getUserObject()).toEqual({});
  });

  it("round-trips a stored object", () => {
    const alice = makeSavedDate("Alice");
    setUserObject({ language: "cs", savedData: [alice] });
    expect(getUserObject()).toEqual({ language: "cs", savedData: [alice] });
  });

  it("replaces the previously stored object rather than merging", () => {
    setUserObject({ language: "cs", savedData: [makeSavedDate("Alice")] });
    setUserObject({ language: "en" });
    expect(getUserObject()).toEqual({ language: "en" });
  });

  it("falls back to an empty object on malformed JSON", () => {
    localStorage.setItem("ASTRO_USER_OBJECT", "{not json");
    expect(getUserObject()).toEqual({});
  });
});

describe("saved data", () => {
  it("starts with no saved data", () => {
    expect(getSavedData()).toEqual([]);
  });

  it("saves and reads back an entry by index", () => {
    setBaseDateJson(0, makeSavedDate("Alice"));
    expect(getBaseDateJson(0)?.name).toBe("Alice");
    expect(getSavedData()).toHaveLength(1);
  });

  it("condenses sparse arrays on save", () => {
    setBaseDateJson(0, makeSavedDate("Alice"));
    setBaseDateJson(3, makeSavedDate("Bob"));
    expect(getSavedData().map((d) => d.name)).toEqual(["Alice", "Bob"]);
  });

  it("removes an entry on delete", () => {
    setBaseDateJson(0, makeSavedDate("Alice"));
    setBaseDateJson(1, makeSavedDate("Bob"));
    deleteBaseDate(0);
    expect(getSavedData().map((d) => d.name)).toEqual(["Bob"]);
  });
});

describe("language", () => {
  it("is undefined until the user picks one", () => {
    expect(getLanguage()).toBeUndefined();
  });

  it("round-trips a stored value", () => {
    setLanguage("cs");
    expect(getLanguage()).toBe("cs");
    setLanguage("en");
    expect(getLanguage()).toBe("en");
  });

  it("ignores an unsupported stored value", () => {
    setUserObject({ language: "not.a.language" } as never);
    expect(getLanguage()).toBeUndefined();
  });

  it("keeps the rest of the user object intact", () => {
    setBaseDateJson(0, makeSavedDate("Alice"));
    setLanguage("cs");
    expect(getSavedData().map((d) => d.name)).toEqual(["Alice"]);
  });
});
