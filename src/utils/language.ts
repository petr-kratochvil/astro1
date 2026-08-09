export type Language = "cs" | "en";

export const DEFAULT_LANGUAGE: Language = "en";

interface LanguageOption {
  code: Language;
  flag: string;
  label: string; // Used in aria-label
  locale: string; // BCP 47 tag for Intl - plain "en" would give US date order
}

const languageOptionByCode: Record<Language, LanguageOption> = {
  cs: { code: "cs", flag: "🇨🇿", label: "Čeština", locale: "cs-CZ" },
  en: { code: "en", flag: "🇬🇧", label: "English", locale: "en-GB" },
};

export const languageOptions: LanguageOption[] =
  Object.values(languageOptionByCode);

export function isLanguage(x: unknown): x is Language {
  return typeof x === "string" && x in languageOptionByCode;
}

export function getLanguageOption(language: Language): LanguageOption {
  return languageOptionByCode[language];
}

// Accepts i18n.language, which is typed as a plain string
export function getLocale(language: string): string {
  return getLanguageOption(isLanguage(language) ? language : DEFAULT_LANGUAGE)
    .locale;
}

// Pick the language. Czech when it appears in `navigator.languages`, English otherwise.
export function detectBrowserLanguage(): Language {
  const preferred =
    typeof navigator === "undefined"
      ? []
      : navigator.languages?.length
        ? navigator.languages
        : [navigator.language];

  return preferred.some((tag) => tag?.toLowerCase().startsWith("cs"))
    ? "cs"
    : DEFAULT_LANGUAGE;
}
