import axios from "axios";
import React from "react";
import constants from "../constants";
import { FormattedObjectPosition, JsonDate, PlanetPosition } from "../types";

const getPlanets = (
  jsonDate: JsonDate,
  setData: (data: PlanetPosition[]) => void
) => {
  // Call Ephemerides API for current planets:
  axios
    .post<FormattedObjectPosition[]>(
      `${constants.ephemeridesApiBase}/position`,
      jsonDate
    )
    .then((response) => {
      setData(
        response.data.map((planet) => ({
          ...planet,
          sign: constants.signList[planet.sign - 1],
        }))
      );
    });
};

export function useCurrentPosition(): PlanetPosition[] {
  const date = new Date();
  const ephDate: JsonDate = {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours() + date.getUTCMinutes() / 60,
  };
  return usePosition(ephDate);
}

export function usePosition(ephDate?: JsonDate): PlanetPosition[] {
  const [data, setData] = React.useState<PlanetPosition[]>([]);

  React.useEffect(() => {
    if (ephDate) {
      getPlanets(ephDate, setData);
    }
    // Intentionally depending on content, not identity, of ephDate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ephDate)]);
  return data;
}
