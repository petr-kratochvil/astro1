import axios from "axios";
import React from "react";
import constants from "../constants";

export default function Page2() {
  const [data, setData] = React.useState([]);
  const baseDatePetr = { year: 1988, month: 7, day: 12, hour: 2 };
  const baseDateJitka = { year: 1973, month: 3, day: 26, hour: 2.25 };
  let [baseDate, setBaseDate] = React.useState(baseDatePetr);
  let [person, setPerson] = React.useState("Petr");

  const getTransits = (baseDate) => {
    // Call Ephemerides API:
    const date = new Date();
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
        setData(
          response.data.filter(
            (d) =>
              !["Moon", "Mercury"].includes(d.pos1.name) &&
              !["vertex"].includes(d.pos2.name) &&
              planetWeight(d.pos1.name) >= planetWeight(d.pos2.name)
          )
        );
      });
  };

  function translateAspect(aspect) {
    switch (aspect) {
      case "conjunction":
        return "🟡";
      case "opposition":
        return "🔆";
      case "square":
        return "🟥";
      case "trine":
        return "💙";
      case "sextile":
        return "🔷";
      case "semiSextile":
        return "🔹";
      case "quincunx":
        return "🌱";

      default:
        return aspect;
    }
  }

  function translatePlanet(planet) {
    const t = {
      Sun: "Slunce",
      Moon: "Luna",
      Mercury: "Merkur",
      Venus: "Venuše",
      Uranus: "Uran",
      Neptune: "Neptun",
    };
    return t[planet] || planet;
  }

  function planetWeight(planet) {
    const w = {
      Sun: 3,
      Moon: 1,
      Mercury: 2,
      Venus: 3,
      Mars: 3,
      Jupiter: 4,
      Saturn: 4,
      Uranus: 4,
      Neptune: 4,
      Pluto: 4,
    };
    return w[planet] || 0;
  }

  function formatTransits() {
    let result = [];
    let currentResult = "";
    let i = 0;
    let currentName = null;
    while (i < data.length - 1) {
      const newName = data[i]?.pos1.name;
      if (newName !== currentName) {
        if (currentName !== null) {
          result.push(currentResult);
          currentResult = "";
        }
        currentResult += translatePlanet(newName) + "\n\n";
        currentName = newName;
      }
      currentResult +=
        translateAspect(data[i].name) +
        " " +
        translatePlanet(data[i].pos2.name) +
        " " +
        data[i].orb.toFixed(1) +
        "\n";
      i++;
    }
    if (currentResult !== "") {
      result.push(currentResult);
    }
    return result;
  }

  React.useEffect(() => getTransits(baseDate), [baseDate]);

  return (
    <>
      <h1>Transits {person}</h1>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button onClick={() => setBaseDate(baseDatePetr) + setPerson("Petr")}>
          Petr
        </button>
        <button onClick={() => setBaseDate(baseDateJitka) + setPerson("Jitka")}>
          Jitka
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {formatTransits().map((result, index) => (
          <pre
          key={index}
            style={{
              border: "1px solid deeppink",
              padding: "10px",
              width: "200px",
              margin: "10px",
            }}
          >
            {result}
          </pre>
        ))}
      </div>
    </>
  );
}
