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
  return signList[sign-1]!;
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

export default { signList, ephemeridesApiBase, signSymbols };
