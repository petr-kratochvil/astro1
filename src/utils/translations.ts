import { TFunction } from "i18next";
import { AspectName, SignName } from "src/constants";
import { CelestialObject } from "src/types";

// The aspect glyphs are language-independent, so this one needs no `t` and is
// deliberately not part of the i18n resources.
export function translateAspectName(aspect: AspectName): string {
  switch (aspect) {
    case "conjunction":
      return "🟡";
    case "opposition":
      return "🔆";
    case "square":
      return "🟥";
    case "trine":
      return "💙";
    case "sextile":
      return "🔷";
    case "semiSextile":
      return "🔹";
    case "quincunx":
      return "🌱";

    default:
      return aspect;
  }
}

// `t` is passed in rather than pulled from a hook, so these stay pure functions
// that can be unit-tested and called from helpers. Call them during render (the
// component owning `t` re-renders on language change) - never store the result.
export function translateCelestialObject(
  planet: CelestialObject,
  t: TFunction
): string {
  if (planet.type === "house") {
    return t("house", { number: planet.houseNumber });
  }
  return t(`celestialObjects.${planet.name}`, { defaultValue: planet.name });
}

export function translateSignName(sign: SignName, t: TFunction): string {
  return t(`signs.${sign}`, { defaultValue: sign });
}
