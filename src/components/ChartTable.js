import BasicTable from "./BasicTable";
import { planetSymbols, signSymbols } from "../constants";

const defaultStyle = {
  useSignSymbols: false,
  usePlanetSymbols: false,
  useSignText: true,
  signSymbolFirst: true,
  degreesFirst: false,
  showMinutes: true,
  showSeconds: false,
};

export default function ChartTable({ chart, title, style = {} }) {
  const usedStyle = { ...defaultStyle, ...style };

  const formatSign = (sign) => {
    const symbol = usedStyle.useSignSymbols ? signSymbols[sign] : "";
    const text = usedStyle.useSignText ? sign : "";
    const space = usedStyle.useSignSymbols && usedStyle.useSignText ? " " : "";
    if (usedStyle.signSymbolFirst) {
      return symbol + space + text;
    }
    return text + space + symbol;
  };

  const formatPlanet = (planet) => {
    return usedStyle.usePlanetSymbols ? planetSymbols[planet] : planet;
  };

  const sign = (a) => formatSign(a.sign);
  const degrees = (a) => a.degrees + "°";

  const columns = [
    (row) => formatPlanet(row.name),
    usedStyle.degreesFirst ? degrees : sign,
    usedStyle.degreesFirst ? sign : degrees,
  ];

  if (usedStyle.showMinutes) columns.push((row) => `${row.minutes}'`);
  if (usedStyle.showSeconds) columns.push((row) => `${row.seconds}''`);
  columns.push((row) => (row.retrograde ? "r" : ""));

  return <BasicTable title={title} columns={columns} data={chart} />;
}
