import axios from "axios";
import React from "react";
import constants from "../constants";

export default function Page2() {
  const [data, setData] = React.useState([]);

  const getTransits = () => {
    // Call Ephemerides API:
    const date = new Date();
    const baseDate = { year: 1988, month: 7, day: 12, hour: 2 };
    const transitDate = {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      hour: date.getUTCHours() + date.getUTCMinutes() / 60,
    };
    axios
      .post(`${constants.ephemeridesApiBase}/transits`, {
        baseDate,
        transitDate,
      })
      .then((response) => {
        setData(response.data);
      });
  };

  function formatTransits() {
    let vypis = '';
    let i = 0;
    let currentName = null;
    while (i < data.length - 1) {
      const newName = data[i]?.pos1.name;
      if (newName !== currentName) {
        vypis += '\n\n' + newName + '\n';
        currentName = newName;
      }
      vypis += data[i].name + ' ' + data[i].orb.toFixed(2) + ' ' + data[i].pos2.name + '\n';
      i++;
    }
    return vypis;
  }

  React.useEffect(getTransits, []);

  return (
    <>
      <h1>Page 2</h1>
      <pre>{formatTransits()}</pre>
    </>
  );
}
