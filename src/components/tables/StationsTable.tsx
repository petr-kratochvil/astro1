import { useTranslation } from "react-i18next";
import BasicTable, { Column } from "./BasicTable";
import { BodyStations, Station } from "src/types";
import {
  formatDateWithWeekday,
  formatPlanet,
  formatSign,
  FormattingStyle,
} from "src/utils/formatting";
import { getLocale } from "src/utils/language";
import { apiUTCToDate } from "src/utils/timeZones";

// Which of the two stations each planet carries this table shows
export type StationDirection = "previous" | "next";

const defaultStyle: FormattingStyle = {
  useSignSymbols: true,
  usePlanetSymbols: false,
  useAspectSymbols: false,
  useSignText: false,
  signSymbolFirst: true,
  degreesFirst: true,
  showMinutes: false,
};

// One planet together with the single station of it that this table shows
interface StationRow {
  planet: BodyStations;
  station: Station;
}

export default function StationsTable({
  stations,
  direction,
  title,
  style = {},
}: {
  stations: BodyStations[];
  direction: StationDirection;
  title: string;
  style?: Partial<FormattingStyle>;
}) {
  const { t, i18n } = useTranslation();
  const usedStyle = { ...defaultStyle, ...style };
  const locale = getLocale(i18n.language);

  // A planet is skipped when it has no station on this side. The API only reports
  // that for a body that never turns retrograde, which none of these eight do.
  const rows: StationRow[] = stations.flatMap((planet) => {
    const station = planet[direction];
    return station ? [{ planet, station }] : [];
  });

  const date = ({ station }: StationRow) => {
    const stationDate = apiUTCToDate(station.date);
    return stationDate ? formatDateWithWeekday(stationDate, locale) : "";
  };
  const sign = ({ station }: StationRow) =>
    formatSign(station.sign, usedStyle, t);
  const degrees = ({ station }: StationRow) => station.degrees + "°";

  const columns: Column<StationRow>[] = [
    ({ planet }) => formatPlanet(planet, usedStyle, t),
    date,
    usedStyle.degreesFirst ? degrees : sign,
    usedStyle.degreesFirst ? sign : degrees,
  ];

  if (usedStyle.showMinutes) {
    columns.push(({ station }) => `${station.minutes}'`);
  }
  // Marked the same way as in ChartTable: "r" where the planet turns retrograde,
  // nothing where it turns direct again
  columns.push(({ station }) => (station.retrograde ? "r" : ""));

  return <BasicTable title={title} columns={columns} data={rows} />;
}
