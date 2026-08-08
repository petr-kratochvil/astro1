import {
  AspectName,
  aspectSymbols,
  planetSymbols,
  SignIndex,
  signNumberToSignName,
  signSymbols,
} from "../constants";
import { TFunction } from "i18next";
import { AspectWithPositions, CelestialObjectPosition } from "../types";
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

export const formatPlanet = (
  pos: CelestialObjectPosition,
  style: FormattingStyle,
  t: TFunction
): string => {
  const name = translateCelestialObject(pos, t);
  return style.usePlanetSymbols
    ? ((planetSymbols as Record<string, string>)[pos.name] ?? name)
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

export const formatDateWithWeekday = (date: Date, locale: string): string => {
  const weekday = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone: "UTC",
  }).format(date);
  const day = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${day}`;
};
