import BasicTable, { Column } from "./BasicTable";
import {
  planetSymbols,
  signSymbols,
  signNumberToSignName,
  SignIndex,
} from "../constants";
import { CelestialObjectPosition } from "../types";
import { translateSign } from "../utils/translations";

interface ChartTableStyle {
  useSignSymbols: boolean;
  usePlanetSymbols: boolean;
  useSignText: boolean;
  signSymbolFirst: boolean;
  degreesFirst: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
}

const defaultStyle: ChartTableStyle = {
  useSignSymbols: false,
  usePlanetSymbols: false,
  useSignText: true,
  signSymbolFirst: true,
  degreesFirst: false,
  showMinutes: true,
  showSeconds: false,
};

export default function ChartTable({
  chart,
  title,
  style = {},
}: {
  chart: CelestialObjectPosition[];
  title: string;
  style?: Partial<ChartTableStyle>;
}) {
  const usedStyle = { ...defaultStyle, ...style };

  const formatSign = (sign: SignIndex): string => {
    const signName = signNumberToSignName(sign);
    const symbol = usedStyle.useSignSymbols ? signSymbols[signName] : "";
    const text = usedStyle.useSignText ? translateSign(signName) : "";
    const space = usedStyle.useSignSymbols && usedStyle.useSignText ? " " : "";
    if (usedStyle.signSymbolFirst) {
      return symbol + space + text;
    }
    return text + space + symbol;
  };

  const formatPlanet = (planet: CelestialObjectPosition): string => {
    const displayName = planet.nameTranslated ?? planet.name;
    return usedStyle.usePlanetSymbols
      ? ((planetSymbols as Record<string, string>)[planet.name] ?? displayName)
      : displayName;
  };

  const sign = (a: CelestialObjectPosition) => formatSign(a.sign);
  const degrees = (a: CelestialObjectPosition) => a.degrees + "°";

  const columns: Column<CelestialObjectPosition>[] = [
    (row) => formatPlanet(row),
    usedStyle.degreesFirst ? degrees : sign,
    usedStyle.degreesFirst ? sign : degrees,
  ];

  if (usedStyle.showMinutes) columns.push((row) => `${row.minutes}'`);
  if (usedStyle.showSeconds) columns.push((row) => `${row.seconds}''`);
  columns.push((row) => (row.retrograde ? "r" : ""));

  return <BasicTable title={title} columns={columns} data={chart} />;
}
