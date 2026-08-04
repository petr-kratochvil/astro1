import React from "react";
import { AspectName, signList, signSymbols } from "../constants";
import { translateAspect, translatePlanet } from "../utils/translations";
import { AspectWithPositions } from "../types";

function planetWeight(planet: string): number {
  const w: Record<string, number> = {
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

function aspectColor(aspect: AspectName): string {
  const c: Record<AspectName, string> = {
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

interface FormattedAspect {
  aspect: AspectName;
  name: string;
  planet: string;
  orb: string;
  strengthening: boolean;
  days: string;
  strong: boolean;
}

interface TransitGroup {
  name: string;
  aspects: FormattedAspect[];
  speed: string;
  pos: number;
  sign: string;
}

function formatTransits(data: AspectWithPositions[]): TransitGroup[] {
  if (data.length === 0) {
    return [];
  }
  const result: TransitGroup[] = [];
  let currentResult: TransitGroup | null = null;
  let i = 0;
  let currentName: string | null = null;
  while (i < data.length) {
    const newName = data[i]?.pos1.name;
    if (newName !== currentName) {
      if (currentResult !== null) {
        result.push(currentResult);
      }
      currentResult = {
        name: translatePlanet({ name: newName }),
        aspects: [],
        speed: "",
        pos: 0,
        sign: "",
      };
      currentName = newName;
    }
    const days = data[i].orb / Math.abs(data[i].orbSpeed ?? 0);
    let m, t;
    if (days > 30) {
      m = days / 30;
    } else if (days > 7) {
      t = days / 7;
    }
    const fixedFormat = (x: number, precision: number) =>
      x.toFixed(x < 10 && Math.abs(x - Math.round(x)) > precision ? 1 : 0);
    const daysFormat = m
      ? `${fixedFormat(m, 0.3)} měs`
      : t
        ? `${fixedFormat(t, 0.2)} týd `
        : `${fixedFormat(days, 0.1)} dní`;

    currentResult = currentResult as TransitGroup;
    currentResult.aspects.push({
      aspect: data[i].name,
      name: translateAspect(data[i].name),
      planet: translatePlanet(data[i].pos2),
      orb: data[i].orb.toFixed(1),
      strengthening: (data[i].orbSpeed ?? 0) < 0,
      days: daysFormat,
      strong:
        planetWeight(data[i].pos1.name) >= planetWeight(data[i].pos2.name) &&
        ["conjunction", "opposition", "square", "trine"].includes(data[i].name),
    });

    // pos1 in a transits response always comes with `speed`
    // - but let's better use defensive style
    currentResult.speed = (data[i].pos1.speed ?? 0).toFixed(2);
    currentResult.pos = data[i].pos1.degrees;
    currentResult.sign = signSymbols[signList[data[i].pos1.sign - 1]];
    i++;
  }
  if (currentResult !== null) {
    result.push(currentResult);
  }
  return result;
}

export default function TransitsBoxes({
  data,
}: {
  data: AspectWithPositions[];
}) {
  const strongStyle = {
    backgroundColor: "#AAFFFF",
    padding: "1px 2.5px",
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {formatTransits(data).map((result, index) => (
        <pre key={index} className="PlanetBox">
          {result.name}{" "}
          <span style={{ color: "LightSeaGreen", fontSize: 12 }}>
            {result.speed}
          </span>{" "}
          <span style={{ color: "Blue", fontSize: 15 }}>
            <span style={{ fontSize: 11 }}>{result.pos}°</span>
            {""}
            {result.sign}
          </span>
          {"\n\n"}
          {result.aspects.map(
            (a, index) => (
              <React.Fragment key={index}>
                {"\n" + a.name + " "}
                <span style={a.strong ? strongStyle : {}}>{a.planet}</span>{" "}
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
              </React.Fragment>
            ),
            ""
          )}
        </pre>
      ))}
    </div>
  );
}
