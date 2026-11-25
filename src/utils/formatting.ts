import {
  AspectName,
  aspectSymbols,
  planetSymbols,
  SignIndex,
  signNumberToSignName,
  signSymbols,
} from "src/constants";
import { TFunction } from "i18next";
import { AspectWithPositions, CelestialObject } from "src/types";
import { translateCelestialObject, translateSignName } from "./translations";

export interface FormattingStyle {
  useSignSymbols: boolean;
  usePlanetSymbols: boolean;
  useAspectSymbols: boolean;
  useSignText: boolean;
  signSymbolFirst: boolean;
  degreesFirst: boolean;
  showMinutes: boolean;
}

export const formatSign = (
  sign: SignIndex,
  style: FormattingStyle,
  t: TFunction
): string => {
  const signName = signNumberToSignName(sign);
  const symbol = style.useSignSymbols ? signSymbols[signName] : "";
  const text = style.useSignText ? translateSignName(signName, t) : "";
  const space = style.useSignSymbols && style.useSignText ? " " : "";
  if (style.signSymbolFirst) {
    return symbol + space + text;
  }
  return text + space + symbol;
};

// Takes a generic CelestialObject, so that it also works for objects carrying
// something else than a position - a station, for instance
export const formatPlanet = (
  object: CelestialObject,
  style: FormattingStyle,
  t: TFunction
): string => {
  const name = translateCelestialObject(object, t);
  return style.usePlanetSymbols
    ? ((planetSymbols as Record<string, string>)[object.name] ?? name)
    : name;
};

export const formatAspect = (
  aspect: AspectName,
  style: FormattingStyle
): string => {
  return style.useAspectSymbols ? aspectSymbols[aspect] : aspect;
};

export const aspectColor = (aspect: AspectWithPositions): string => {
  let color = { r: 255, g: 255, b: 255 };
  switch (aspect.name) {
    case "conjunction":
      color = { r: 255, g: 255, b: 0 };
      break;
    case "opposition":
      color = { r: 0, g: 255, b: 0 };
      break;
    case "trine":
      color = { r: 0, g: 170, b: 255 };
      break;
    case "square":
      color = { r: 255, g: 60, b: 80 };
      break;
    case "sextile":
      color = { r: 90, g: 150, b: 255 };
      break;
    default:
      color = { r: 255, g: 255, b: 255 };
  }
  const lighten = (Math.min(aspect.orb, 8) / 8) * 225;
  color = {
    r: Math.min(255, color.r + lighten),
    g: Math.min(255, color.g + lighten),
    b: Math.min(color.b + lighten),
  };
  return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
};

// Which clock a moment is read off. Transit dates are calendar dates the API works
// with in UTC; a station, on the other hand, is an instant, and is shown the way the
// saved records are - on the reader's own clock.
export type DisplayTimeZone = "UTC" | "local";

// Intl reads an absent timeZone as the one the browser is in
const intlTimeZone = (timeZone: DisplayTimeZone) =>
  timeZone === "UTC" ? "UTC" : undefined;

export const formatDateWithWeekday = (
  date: Date,
  locale: string,
  timeZone: DisplayTimeZone = "UTC"
): string => {
  const weekday = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone: intlTimeZone(timeZone),
  }).format(date);
  const day = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: intlTimeZone(timeZone),
  }).format(date);
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${day}`;
};

export const formatTimeOfDay = (
  date: Date,
  locale: string,
  timeZone: DisplayTimeZone = "UTC"
): string =>
  new Intl.DateTimeFormat(locale, {
    timeStyle: "short",
    // Always a 24 hour clock, whatever the locale would pick on its own
    hourCycle: "h23",
    timeZone: intlTimeZone(timeZone),
  }).format(date);

// "Fri, 13 Nov 2026 16:53" in English, "Pá, 13. 11. 2026 16:53" in Czech - each
// half keeps the form its own locale uses
export const formatDateTimeWithWeekday = (
  date: Date,
  locale: string,
  timeZone: DisplayTimeZone = "UTC"
): string =>
  `${formatDateWithWeekday(date, locale, timeZone)}, ${formatTimeOfDay(date, locale, timeZone)}`;
