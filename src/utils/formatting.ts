import { AspectName, aspectSymbols, planetSymbols, SignIndex, signNumberToSignName, signSymbols } from "../constants";
import { AspectWithPositions, CelestialObjectPosition } from "../types";
import { translateSignName } from "./translations";

export interface FormattingStyle {
  useSignSymbols: boolean;
  usePlanetSymbols: boolean;
  useAspectSymbols: boolean;
  useSignText: boolean;
  signSymbolFirst: boolean;
  degreesFirst: boolean;
  showMinutes: boolean;
}

export const formatSign = (sign: SignIndex, style: FormattingStyle): string => {
  const signName = signNumberToSignName(sign);
  const symbol = style.useSignSymbols ? signSymbols[signName] : "";
  const text = style.useSignText ? translateSignName(signName) : "";
  const space = style.useSignSymbols && style.useSignText ? " " : "";
  if (style.signSymbolFirst) {
    return symbol + space + text;
  }
  return text + space + symbol;
};

export const formatPlanet = (pos: CelestialObjectPosition, style: FormattingStyle): string => {
  return style.usePlanetSymbols
    ? ((planetSymbols as Record<string, string>)[pos.name] ??
        pos.nameTranslated)
    : pos.nameTranslated;
};

export const formatAspect = (aspect: AspectName, style: FormattingStyle): string => {
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
