import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import i18n from "src/i18n";
import { createAppStore } from "src/store";
import { setTransitDateTimestamp } from "src/store/slices/uiSlice";
import { setBaseDateJson } from "src/utils/localStorage";
import DateNavigation from "./DateNavigation";

// The selected date is only ever moved by whole days/months, so the assertions
// compare local calendar dates - a DST change makes the day a non-constant
// number of milliseconds.
function localDateKey(timestamp: number): string {
  const date = new Date(timestamp);
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
}

// The month/year buttons use non-breaking spaces around the arrows
function buttonByLabel(label: string) {
  return screen.getByRole("button", {
    name: (accessibleName) =>
      accessibleName.replace(/\s+/g, " ").trim() === label,
  });
}

function renderDateNavigation() {
  const store = createAppStore();
  render(
    <Provider store={store}>
      <DateNavigation>
        <div>page content</div>
      </DateNavigation>
    </Provider>
  );
  return {
    selectedDate: () => localDateKey(store.getState().ui.transitDateTimestamp),
    setSelectedDate: (date: Date) =>
      store.dispatch(setTransitDateTimestamp(date.getTime())),
  };
}

beforeEach(async () => {
  localStorage.clear();
  // The record selector is rendered with a record to pick, as on a real page
  setBaseDateJson(0, {
    name: "Test record",
    year: 1980,
    month: 6,
    day: 1,
    hour: 12,
    customCoordinates: false,
    lat: 50.075,
    lon: 14.437,
  });
  await i18n.changeLanguage("en");
});

afterEach(() => {
  // Vitest runs without `globals`, so RTL's automatic cleanup is not registered.
  cleanup();
});

describe("DateNavigation", () => {
  it("renders the page content", () => {
    renderDateNavigation();

    expect(screen.getByText("page content")).toBeInTheDocument();
  });

  it("shows the selected day and keeps the label in sync", async () => {
    const user = userEvent.setup();
    const { selectedDate } = renderDateNavigation();

    const dayOfMonth = () => new Date().getDate();
    expect(screen.getByText(new RegExp(`\\b${dayOfMonth()}\\b`))).toBeDefined();

    await user.click(buttonByLabel("▷▷"));

    const [, , day] = selectedDate().split("-");
    expect(screen.getByText(new RegExp(`\\b${day}\\b`))).toBeDefined();
  });

  it("moves the selected date by a day", async () => {
    const user = userEvent.setup();
    const { selectedDate, setSelectedDate } = renderDateNavigation();
    setSelectedDate(new Date(2024, 2, 15, 12));

    await user.click(buttonByLabel("▷▷"));
    expect(selectedDate()).toBe("2024-3-16");

    await user.click(buttonByLabel("◁◁"));
    await user.click(buttonByLabel("◁◁"));
    expect(selectedDate()).toBe("2024-3-14");
  });

  it("moves the selected date by a month and by a year", async () => {
    const user = userEvent.setup();
    const { selectedDate, setSelectedDate } = renderDateNavigation();
    setSelectedDate(new Date(2024, 2, 15, 12));

    await user.click(buttonByLabel("mo. ▷"));
    expect(selectedDate()).toBe("2024-4-15");

    await user.click(buttonByLabel("◁ mo."));
    await user.click(buttonByLabel("◁ mo."));
    expect(selectedDate()).toBe("2024-2-15");

    await user.click(buttonByLabel("yr ▷"));
    expect(selectedDate()).toBe("2025-2-15");

    await user.click(buttonByLabel("◁ yr"));
    await user.click(buttonByLabel("◁ yr"));
    expect(selectedDate()).toBe("2023-2-15");
  });

  it("resets the selected date to today", async () => {
    const user = userEvent.setup();
    const { selectedDate, setSelectedDate } = renderDateNavigation();
    setSelectedDate(new Date(2024, 2, 15, 12));

    await user.click(buttonByLabel("today"));

    expect(selectedDate()).toBe(localDateKey(Date.now()));
  });

  it("moves the selected date by the arrow keys", async () => {
    const user = userEvent.setup();
    const { selectedDate, setSelectedDate } = renderDateNavigation();
    setSelectedDate(new Date(2024, 2, 15, 12));

    await user.keyboard("{ArrowRight}");
    expect(selectedDate()).toBe("2024-3-16");

    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(selectedDate()).toBe("2024-3-14");

    // With a modifier, the arrows move whole months
    await user.keyboard("{Control>}{ArrowRight}{/Control}");
    expect(selectedDate()).toBe("2024-4-14");

    await user.keyboard("{Alt>}{ArrowLeft}{/Alt}");
    expect(selectedDate()).toBe("2024-3-14");
  });

  it("stops listening to the arrow keys once unmounted", async () => {
    const user = userEvent.setup();
    const { selectedDate, setSelectedDate } = renderDateNavigation();
    setSelectedDate(new Date(2024, 2, 15, 12));

    cleanup();
    await user.keyboard("{ArrowRight}");

    expect(selectedDate()).toBe("2024-3-15");
  });
});
