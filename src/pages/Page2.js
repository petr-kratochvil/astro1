import axios from "axios";
import React from "react";
import constants from "../constants";

export default function Page2() {
  const [data, setData] = React.useState([]);
  const baseDatePetr = { year: 1988, month: 7, day: 12, hour: 2 };
  const baseDateJitka = { year: 1973, month: 3, day: 26, hour: 2.25 };
  const [baseDateJson, setBaseDateJson] = React.useState(baseDatePetr);
  const [person, setPerson] = React.useState("Petr");
  const [transitDate, setTransitDate] = React.useState(new Date());

  function getTransits(baseDate, transitDate) {
    // Call Ephemerides API:
    const transitDateJson = {
      year: transitDate.getUTCFullYear(),
      month: transitDate.getUTCMonth() + 1,
      day: transitDate.getUTCDate(),
      hour: transitDate.getUTCHours() + transitDate.getUTCMinutes() / 60,
    };
    axios
      .post(`${constants.ephemeridesApiBase}/transits`, {
        baseDate,
        transitDate: transitDateJson,
      })
      .then((response) => {
        setData(
          response.data.filter(
            (d) =>
              !["Moon", "Mercury"].includes(d.pos1.name) &&
              !["vertex"].includes(d.pos2.name)
            // && planetWeight(d.pos1.name) >= planetWeight(d.pos2.name)
          )
        );
      });
  }

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
    while (i < data.length) {
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

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  React.useEffect(
    () => getTransits(baseDateJson, transitDate),
    [baseDateJson, transitDate]
  );

  function handleKeyDown(event) {
    switch (event.key) {
      case "ArrowLeft":
        setTransitDate(addDays(transitDate, -1));
        break;
      case "ArrowRight":
        setTransitDate(addDays(transitDate, +1));
        break;
      default:
        break;
    }
  }

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div>
      <h1>Transits {person}</h1>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <button
          onClick={() => setBaseDateJson(baseDatePetr) + setPerson("Petr")}
        >
          Petr
        </button>
        <button
          onClick={() => setBaseDateJson(baseDateJitka) + setPerson("Jitka")}
        >
          Jitka
        </button>
        <button onClick={() => setTransitDate(addDays(transitDate, -1))}>
          &nbsp;&nbsp;&lt;&lt;&nbsp;&nbsp;
        </button>
        <div>
          {transitDate.getUTCDate()}. {transitDate.getUTCMonth() + 1}.{" "}
          {transitDate.getUTCFullYear()}
        </div>
        <button onClick={() => setTransitDate(addDays(transitDate, +1))}>
          &nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
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
    </div>
  );
}
