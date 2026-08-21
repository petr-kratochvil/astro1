export const ephemeridesApiBase = import.meta.env.VITE_EPHEMERIDES_API_BASE;

export const signList = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

export type SignName = (typeof signList)[number];
export type SignIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const signSymbols: Record<SignName, string> = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
} as const;

export const planetSymbols = {
  Sun: "☉",
  Moon: "☾",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
  TrueNode: "☊",
  Chiron: "ch",
} as const;

export function signNumberToSignName(sign: SignIndex): SignName {
  return signList[sign - 1]!;
}

export const aspectSymbols = {
  conjunction: "☌",
  opposition: "☍",
  square: "□",
  trine: "△",
  sextile: "✶",
  semiSextile: "✧",
  quincunx: "⚻",
} as const;

export type AspectName = keyof typeof aspectSymbols;

export interface City {
  name: string;
  lat: number;
  lon: number;
  id: number;
}

export const cityList: City[] = [
  { name: "Praha", lat: 50.075, lon: 14.437, id: 554782 },
  { name: "Havlíčkův Brod", lat: 49.604, lon: 15.579, id: 568414 },
  { name: "Jihlava", lat: 49.415, lon: 15.595, id: 586846 },
  { name: "Brno", lat: 49.195, lon: 16.606, id: 582786 },
  { name: "Ostrava", lat: 49.821, lon: 18.262, id: 554821 },
  { name: "Plzeň", lat: 49.738, lon: 13.373, id: 554791 },
  { name: "Olomouc", lat: 49.593, lon: 17.25, id: 500496 },
  { name: "Hradec Králové", lat: 50.21, lon: 15.825, id: 569810 },
  { name: "Karlovy Vary", lat: 50.231, lon: 12.872, id: 554961 },
  { name: "Liberec", lat: 50.766, lon: 15.054, id: 563889 },
  { name: "České Budějovice", lat: 48.975, lon: 14.48, id: 544256 },
  { name: "Zlín", lat: 49.224, lon: 17.662, id: 585068 },
  { name: "Ústí nad Labem", lat: 50.661, lon: 14.053, id: 554804 },
  { name: "Pardubice", lat: 50.034, lon: 15.781, id: 555134 },
].sort((a, b) => a.name.localeCompare(b.name));

export const defaultCity: City = {
  name: "Praha",
  lat: 50.075,
  lon: 14.437,
  id: 554782,
};
