import { AspectName } from "../constants";
import { CelestialObject } from "../types";

export function translateAspect(aspect: AspectName): string {
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

export function translatePlanet(planet: CelestialObject): string {
  const t: Record<string, string> = {
    Sun: "Slunce",
    Moon: "Luna",
    Mercury: "Merkur",
    Venus: "Venuše",
    Uranus: "Uran",
    Neptune: "Neptun",
  };
  if (planet.type === "house") {
    return `${planet.houseNumber}. dům`;
  }
  return t[planet.name] || planet.name;
}
