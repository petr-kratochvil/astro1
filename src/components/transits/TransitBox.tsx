import React from "react";
import { AspectName } from "src/constants";

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

const strongStyle = {
  backgroundColor: "#AAFFFF",
  padding: "1px 2.5px",
};

export interface FormattedAspect {
  aspect: AspectName;
  name: string;
  planet: string;
  orb: string;
  strengthening: boolean;
  days: string;
  daysShort: string;
  strong: boolean;
}

export interface TransitGroup {
  name: string;
  aspects: FormattedAspect[];
  speed: string;
  pos: number;
  sign: string;
}

export default function TransitBox({ result }: { result: TransitGroup }) {
  return (
    <pre className="PlanetBox">
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
      {result.aspects.map((a, index) => (
        <React.Fragment key={index}>
          {"\n" + a.name + " "}
          <span style={a.strong ? strongStyle : {}}>{a.planet}</span> {a.orb}{" "}
          <span
            style={{
              color: a.strengthening ? aspectColor(a.aspect) : "lightgrey",
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
            <span className="transitBoxesDays">{a.days}</span>
            <span className="transitBoxesDaysShort">{a.daysShort}</span>
          </span>
        </React.Fragment>
      ))}
    </pre>
  );
}
