import axios from "axios";
import React from "react";
import constants from "../constants";

const getPlanets = (body, setData) => {
  // Call Ephemerides API for current planets:
  axios
    .post(`${constants.ephemeridesApiBase}/position`, body)
    .then((response) => {
      setData(
        response.data.map((planet) => ({
          ...planet,
          sign: constants.signList[planet.sign - 1],
        }))
      );
    });
};

export function useCurrentPosition() {
  const date = new Date();
  const ephDate = {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours() + date.getUTCMinutes() / 60,
  };
  return usePosition(ephDate);
}

export function usePosition(ephDate) {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getPlanets(ephDate, setData);
    // Intentionally depending on content, not identity, of ephDate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ephDate)]);
  return data;
}
