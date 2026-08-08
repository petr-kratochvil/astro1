import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSelect from "./LanguageSelect";
import i18n from "../i18n";
import { getLanguage } from "../utils/localStorage";

beforeEach(async () => {
  localStorage.clear();
  await i18n.changeLanguage("cs");
});

afterEach(() => {
  // Vitest runs without `globals`, so RTL's automatic cleanup is not registered.
  cleanup();
});

describe("LanguageSelect", () => {
  it("shows the flag of the active language", () => {
    render(<LanguageSelect />);

    expect(screen.getByRole("button")).toHaveAccessibleName("Jazyk: Čeština");
  });

  it("switches i18next and persists the choice when an option is picked", async () => {
    const user = userEvent.setup();
    render(<LanguageSelect />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("menuitem", { name: "English" }));

    expect(i18n.language).toBe("en");
    expect(getLanguage()).toBe("en");
    // the label itself is translated, hence "Language:" rather than "Jazyk:"
    expect(screen.getByRole("button")).toHaveAccessibleName(
      "Language: English"
    );
  });

  it("follows a language change made elsewhere in the app", async () => {
    render(<LanguageSelect />);

    await i18n.changeLanguage("en");

    expect(await screen.findByRole("button")).toHaveAccessibleName(
      "Language: English"
    );
  });
});
