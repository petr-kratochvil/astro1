import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { signNumberToSignName, signSymbols } from "src/constants";
import { AspectWithPositions } from "src/types";
import {
  translateAspectName,
  translateCelestialObject,
} from "../../utils/translations";
import TransitBox, { TransitGroup } from "./TransitBox";

function planetWeight(planet: string): number {
  const w: Record<string, number> = {
    Sun: 3,
    Moon: 1,
    Mercury: 2,
    Venus: 3,
    Mars: 3,
    Jupiter: 4,
    Saturn: 4,
    Uranus: 5,
    Neptune: 5,
    Pluto: 6,
  };
  return w[planet] || 0;
}

function formatTransits(
  data: AspectWithPositions[],
  t: TFunction
): TransitGroup[] {
  if (data.length === 0) {
    return [];
  }
  const result: TransitGroup[] = [];
  let currentResult: TransitGroup | null = null;
  let currentName: string | null = null;
  for (const transitItem of data) {
    const newBoxName = transitItem.pos1.name;
    if (newBoxName !== currentName) {
      if (currentResult !== null) {
        result.push(currentResult);
      }
      currentResult = {
        name: translateCelestialObject(transitItem.pos1, t),
        aspects: [],
        speed: "",
        pos: 0,
        sign: "",
      };
      currentName = newBoxName;
    }
    const days = transitItem.orb / Math.abs(transitItem.orbSpeed ?? 0);
    let months = 0;
    let weeks = 0;
    if (days > 30) {
      months = days / 30;
    } else if (days > 7) {
      weeks = days / 7;
    }
    const fixedFormat = (x: number, precision: number) =>
      x.toFixed(x < 10 && Math.abs(x - Math.round(x)) > precision ? 1 : 0);
    // `count` selects the plural form, so it is taken from the rounded `value`
    const duration = (key: string, x: number, precision: number) => {
      const value = fixedFormat(x, precision);
      return t(key, { count: Number(value), value });
    };
    const daysFormat = (short: boolean) => {
      const shortString = short ? "short_" : "";
      return months
        ? duration(`transits.${shortString}months`, months, 0.3)
        : weeks
        ? duration(`transits.${shortString}weeks`, weeks, 0.2) + " "
        : duration(`transits.${shortString}days`, days, 0.1);
    };

    currentResult = currentResult as TransitGroup;
    currentResult.aspects.push({
      aspect: transitItem.name,
      name: translateAspectName(transitItem.name),
      planet: translateCelestialObject(transitItem.pos2, t),
      orb: transitItem.orb.toFixed(1),
      strengthening: (transitItem.orbSpeed ?? 0) < 0,
      days: daysFormat(false),
      daysShort: daysFormat(true),
      strong:
        planetWeight(transitItem.pos1.name) >=
          planetWeight(transitItem.pos2.name) &&
        ["conjunction", "opposition", "square", "trine"].includes(
          transitItem.name
        ),
    });

    // pos1 in a transits response always comes with `speed`
    // - but let's better use defensive style
    currentResult.speed = (transitItem.pos1.speed ?? 0).toFixed(2);
    currentResult.pos = transitItem.pos1.degrees;
    currentResult.sign =
      signSymbols[signNumberToSignName(transitItem.pos1.sign)];
  }
  if (currentResult !== null) {
    result.push(currentResult);
  }
  return result;
}

export default function TransitsBoxes({
  data,
}: {
  data: AspectWithPositions[];
}) {
  const { t } = useTranslation();

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {formatTransits(data, t).map((result, index) => (
        <TransitBox key={index} result={result} />
      ))}
    </div>
  );
}
