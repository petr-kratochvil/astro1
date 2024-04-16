import axios from "axios";
import React from "react";
import constants from "../constants";

export default function useCurrentPosition() {
  const [data, setData] = React.useState([]);

  const getCurrentPlanets = () => {
    // Call Ephemerides API for current planets:
    const date = new Date();
    const body = {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      hour: date.getUTCHours() + date.getUTCMinutes() / 60,
    };
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
  }
  React.useEffect(getCurrentPlanets, []);
  return data;
}