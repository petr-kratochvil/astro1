import axios from "axios";
import React from "react";
import constants from "src/constants";
import { CelestialObjectPosition, JsonDate } from "src/types";

const getPlanets = (
  jsonDate: JsonDate,
  setData: (data: CelestialObjectPosition[]) => void
) => {
  // Call Ephemerides API for current planets:
  axios
    .post<CelestialObjectPosition[]>(
      `${constants.ephemeridesApiBase}/position`,
      jsonDate
    )
    .then((response) => {
      setData(response.data);
    });
};

export function useCurrentPosition(): CelestialObjectPosition[] {
  const date = new Date();
  const ephDate: JsonDate = {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours() + date.getUTCMinutes() / 60,
  };
  return usePosition(ephDate);
}

export function usePosition(ephDate?: JsonDate): CelestialObjectPosition[] {
  const [data, setData] = React.useState<CelestialObjectPosition[]>([]);

  React.useEffect(() => {
    if (ephDate) {
      getPlanets(ephDate, setData);
    }
    // Intentionally depending on content, not identity, of ephDate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ephDate)]);
  return data;
}
