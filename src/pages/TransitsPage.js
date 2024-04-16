import axios from "axios";
import React from "react";
import constants, { signList, signSymbols } from "../constants";

export default function TransitsPage() {
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
              !["vertex"].includes(d.pos2.name) &&
              ![ "quincunx"].includes(d.name)
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
      Uranus: 5,
      Neptune: 5,
      Pluto: 6,
    };
    return w[planet] || 0;
  }

  function aspectColor(aspect) {
    const c = {
      conjunction: "gold",
      opposition: "gold",
      square: "DeepPink",
      trine: "DodgerBlue	",
      sextile: "DodgerBlue	",
      semiSextile: "DodgerBlue	",
      quincunx: "yellowgreen",
    };
    return c[aspect] || "black";
  }

  function formatTransits() {
    let result = [];
    let currentResult = { aspects: [] };
    let i = 0;
    let currentName = null;
    while (i < data.length) {
      const newName = data[i]?.pos1.name;
      if (newName !== currentName) {
        if (currentName !== null) {
          result.push(currentResult);
          currentResult = {};
        }
        currentResult.name = translatePlanet(newName);
        currentResult.aspects = [];
        currentName = newName;
      }
      let days = data[i].orb / Math.abs(data[i].orbSpeed);
      let m, t;
      if (days > 30) {
        m = days / 30;
      } else if (days > 7) {
        t = days / 7;
      }
      const fixedFormat = (x, precision) =>
        x.toFixed(x < 10 && Math.abs(x - Math.round(x)) > precision ? 1 : 0);
      const daysFormat = m
        ? `${fixedFormat(m, 0.3)} měs`
        : t
        ? `${fixedFormat(t, 0.2)} týd `
        : `${fixedFormat(days, 0.1)}`;
      currentResult.aspects.push({
        aspect: data[i].name,
        name: translateAspect(data[i].name),
        planet: translatePlanet(data[i].pos2.name),
        orb: data[i].orb.toFixed(1),
        strengthening: data[i].orbSpeed < 0,
        days: daysFormat,
        strong:
          planetWeight(data[i].pos1.name) >= planetWeight(data[i].pos2.name) &&
          ["conjunction", "opposition", "square", "trine"].includes(
            data[i].name
          ),
      });
      currentResult.speed = data[i].pos1.speed.toFixed(2);
      currentResult.pos = data[i].pos1.degrees;
      currentResult.sign = signSymbols[signList[data[i].pos1.sign-1]];
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

  function addMonths(date, months) {
    var result = new Date(date);
    result.setMonth(result.getMonth() + months);
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

  const strongStyle = {
    backgroundColor: "#AAFFFF",
    padding: "1px 2.5px",
  };

  const buttonsMenuStyle = { display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginBottom: "10px" }

  return (
    <div>
      <h1 style={{color: 'slateblue', textAlign: 'center'}}>{person}'s transits</h1>
      <div style={buttonsMenuStyle}>
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
      </div>
      <div style={buttonsMenuStyle}>
        
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
      <div style={buttonsMenuStyle}>
        <button onClick={() => setTransitDate(addMonths(transitDate, -12))}>
          &nbsp;&nbsp;&lt;&lt;&nbsp;rok
        </button>
        <button onClick={() => setTransitDate(addMonths(transitDate, -1))}>
          &nbsp;&nbsp;&lt;&lt;&nbsp;měs.
        </button>
        <button onClick={() => setTransitDate(new Date())}>
          &nbsp;&nbsp;dnes&nbsp;&nbsp;
        </button>
        <button onClick={() => setTransitDate(addMonths(transitDate, +1))}>
          měs.&nbsp;&gt;&gt;&nbsp;&nbsp;
        </button>
        <button onClick={() => setTransitDate(addMonths(transitDate, +12))}>
          rok&nbsp;&gt;&gt;&nbsp;&nbsp;
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {formatTransits().map((result, index) => (
          <pre
            key={index}
            className="PlanetBox"
          >
            {result.name}{" "}
            <span style={{ color: "LightSeaGreen", fontSize: 12 }}>
              {result.speed}
            </span>
            {' '}
            <span style={{ color: "Blue", fontSize: 15 }}>
              <span style={{ fontSize: 11 }}>{result.pos}°</span>{''}{result.sign} 
            </span>
            {"\n\n"}
            {result.aspects.map(
              (a) => (
                <>
                  {"\n" + a.name + " "}
                  <span style={a.strong ? strongStyle : {}}>
                    {a.planet}
                  </span>{" "}
                  {a.orb}{" "}
                  <span
                    style={{
                      color: a.strengthening
                        ? aspectColor(a.aspect)
                        : "lightgrey",
                    }}
                  >
                    {a.strengthening ? "⬆" : "⬇"}
                  </span>{" "}
                  <span
                    style={{
                      color: a.strengthening ? "LightSeaGreen" : "lightgray",
                      fontSize: 11,
                    }}
                  >
                    {a.days}
                  </span>
                </>
              ),
              ""
            )}
          </pre>
        ))}
      </div>
    </div>
  );
}
