import { SignName, AspectName } from "../constants";

const signPositions = {
  Aries: 0,
  Taurus: 30,
  Gemini: 60,
  Cancer: 90,
  Leo: 120,
  Virgo: 150,
  Libra: 180,
  Scorpio: 210,
  Sagittarius: 240,
  Capricorn: 270,
  Aquarius: 300,
  Pisces: 330,
};

interface ChartPosition {
  sign: SignName;
  degrees: number;
  minutes?: number;
  seconds?: number;
}

type ComputedAspectName = Extract<
  AspectName,
  "conjunction" | "opposition" | "square" | "trine" | "sextile"
>;

interface AspectResult {
  name: ComputedAspectName;
  orb: number;
  pos1: ChartPosition;
  pos2: ChartPosition;
}

const degPosition = (planet: ChartPosition): number => {
  return (
    signPositions[planet.sign] +
    planet.degrees +
    (planet.minutes ?? 0) / 60 +
    (planet.seconds ?? 0) / 3600
  );
};

const orb: Record<ComputedAspectName, number> = {
  conjunction: 10,
  opposition: 8,
  square: 5,
  trine: 5,
  sextile: 3,
};

export const getAspects = (
  chart1: ChartPosition[],
  chart2: ChartPosition[]
): AspectResult[] => {
  const aspects: AspectResult[] = [];
  for (const elem1 of chart1) {
    for (const elem2 of chart2) {
      const diff = Math.abs(degPosition(elem1) - degPosition(elem2));
      const conOrb = Math.abs(diff);
      if (conOrb < orb.conjunction) {
        aspects.push({
          name: "conjunction",
          orb: conOrb,
          pos1: elem1,
          pos2: elem2,
        });
      }
      const opOrb = Math.abs(diff - 180);
      if (opOrb < orb.opposition) {
        aspects.push({
          name: "opposition",
          orb: opOrb,
          pos1: elem1,
          pos2: elem2,
        });
      }
      const sqOrb = Math.min(Math.abs(diff - 90), Math.abs(diff - 270));
      if (sqOrb < orb.square) {
        aspects.push({
          name: "square",
          orb: sqOrb,
          pos1: elem1,
          pos2: elem2,
        });
      }
      const trOrb = Math.min(Math.abs(diff - 120), Math.abs(diff - 240));
      if (trOrb < orb.trine) {
        aspects.push({
          name: "trine",
          orb: trOrb,
          pos1: elem1,
          pos2: elem2,
        });
      }
      const sexOrb = Math.min(Math.abs(diff - 60), Math.abs(diff - 300));
      if (sexOrb < orb.sextile) {
        aspects.push({
          name: "sextile",
          orb: sexOrb,
          pos1: elem1,
          pos2: elem2,
        });
      }
    }
  }
  return aspects;
};
