import { AspectName, SignName } from "../constants";
import { CelestialObject } from "../types";

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

export function translateCelestialObject(planet: CelestialObject): string {
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
  return t[planet.name] ?? planet.name;
}

export function translateSignName(sign: SignName): string {
  const t: Record<SignName, string> = {
    Aries: "Beran",
    Taurus: "Býk",
    Gemini: "Blíženci",
    Cancer: "Rak",
    Leo: "Lev",
    Virgo: "Panna",
    Libra: "Váhy",
    Scorpio: "Štír",
    Sagittarius: "Střelec",
    Capricorn: "Kozoroh",
    Aquarius: "Vodnář",
    Pisces: "Ryby",
  };
  return t[sign] ?? sign;
}