import BasicTable, { Column } from "./BasicTable";
import { planetSymbols, signSymbols, SignName } from "../constants";
import { PlanetPosition } from "../types";

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
  chart: PlanetPosition[];
  title: string;
  style?: Partial<ChartTableStyle>;
}) {
  const usedStyle = { ...defaultStyle, ...style };

  const formatSign = (sign: SignName): string => {
    const symbol = usedStyle.useSignSymbols ? signSymbols[sign] : "";
    const text = usedStyle.useSignText ? sign : "";
    const space = usedStyle.useSignSymbols && usedStyle.useSignText ? " " : "";
    if (usedStyle.signSymbolFirst) {
      return symbol + space + text;
    }
    return text + space + symbol;
  };

  // NB: `planet` here is already translated to Czech by the caller
  // (translatePlanet), so `usePlanetSymbols` never actually matches — a
  // pre-existing dormant style option, not something introduced here.
  const formatPlanet = (planet: string): string => {
    return usedStyle.usePlanetSymbols
      ? (planetSymbols as Record<string, string>)[planet]
      : planet;
  };

  const sign = (a: PlanetPosition) => formatSign(a.sign);
  const degrees = (a: PlanetPosition) => a.degrees + "°";

  const columns: Column<PlanetPosition>[] = [
    (row) => formatPlanet(row.name),
    usedStyle.degreesFirst ? degrees : sign,
    usedStyle.degreesFirst ? sign : degrees,
  ];

  if (usedStyle.showMinutes) columns.push((row) => `${row.minutes}'`);
  if (usedStyle.showSeconds) columns.push((row) => `${row.seconds}''`);
  columns.push((row) => (row.retrograde ? "r" : ""));

  return <BasicTable title={title} columns={columns} data={chart} />;
}
