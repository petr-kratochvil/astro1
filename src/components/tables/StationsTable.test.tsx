import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import StationsTable from "./StationsTable";
import i18n from "src/i18n";
import { BodyStations } from "src/types";

const mercury: BodyStations = {
  type: "body",
  name: "Mercury",
  previous: {
    position: 230.978,
    sign: 8,
    degrees: 20,
    minutes: 58,
    seconds: 44,
    retrograde: true,
    date: { year: 2026, month: 10, day: 24, hour: 7.18 },
  },
  next: {
    position: 215.033,
    sign: 8,
    degrees: 5,
    minutes: 2,
    seconds: 0,
    retrograde: false,
    date: { year: 2026, month: 11, day: 13, hour: 15.88 },
  },
};

// A planet the API reported no station for on either side
const withoutStations: BodyStations = {
  type: "body",
  name: "Pluto",
  previous: null,
  next: null,
};

const rowOf = (name: string) => screen.getByText(name).closest("tr")!;

beforeEach(async () => {
  await i18n.changeLanguage("en");
});

afterEach(() => {
  // Vitest runs without `globals`, so RTL's automatic cleanup is not registered.
  cleanup();
});

describe("StationsTable", () => {
  it("shows the previous station of each planet", () => {
    render(
      <StationsTable
        stations={[mercury]}
        direction="previous"
        title="Last station"
      />
    );

    expect(screen.getByText("Last station")).toBeInTheDocument();
    const row = within(rowOf("Mercury"));
    expect(row.getByText("Sat, 24 Oct 2026")).toBeInTheDocument();
    expect(row.getByText("20°")).toBeInTheDocument();
    expect(row.getByText("♏")).toBeInTheDocument();
    // the planet turns retrograde at this station
    expect(row.getByText("r")).toBeInTheDocument();
  });

  it("shows the next station when asked for the other direction", () => {
    render(
      <StationsTable
        stations={[mercury]}
        direction="next"
        title="Next station"
      />
    );

    const row = within(rowOf("Mercury"));
    expect(row.getByText("Fri, 13 Nov 2026")).toBeInTheDocument();
    expect(row.getByText("5°")).toBeInTheDocument();
    // the planet turns direct again at this station, which is left unmarked
    expect(row.queryByText("r")).not.toBeInTheDocument();
  });

  it("leaves out a planet that has no station on the shown side", () => {
    render(
      <StationsTable
        stations={[mercury, withoutStations]}
        direction="previous"
        title="Last station"
      />
    );

    expect(screen.getByText("Mercury")).toBeInTheDocument();
    expect(screen.queryByText("Pluto")).not.toBeInTheDocument();
  });

  it("translates the planet name", async () => {
    await i18n.changeLanguage("cs");
    render(
      <StationsTable
        stations={[mercury]}
        direction="previous"
        title="Poslední stacionární bod"
      />
    );

    expect(screen.getByText("Merkur")).toBeInTheDocument();
  });
});
