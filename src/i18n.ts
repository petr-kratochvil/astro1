import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import cs from "./locales/cs";
import en from "./locales/en";
import { DEFAULT_LANGUAGE, detectBrowserLanguage } from "./utils/language";
import { getLanguage } from "./utils/localStorage";

const resources = { cs, en };

export function resolveInitialLanguage() {
  return getLanguage() ?? detectBrowserLanguage();
}

i18n.use(initReactI18next).init({
  resources,
  lng: resolveInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
