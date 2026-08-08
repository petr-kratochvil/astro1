import {
  aspectSymbols,
  AspectName,
  planetSymbols,
  signNumberToSignName,
  signSymbols,
  SignIndex,
} from "../constants";
import { translatePlanet, translateSign } from "../utils/translations";
import { AspectWithPositions, CelestialObjectPosition } from "../types";

interface AspectTableStyle {
  useSignSymbols: boolean;
  usePlanetSymbols: boolean;
  useAspectSymbols: boolean;
  useSignText: boolean;
  signSymbolFirst: boolean;
  degreesFirst: boolean;
  showMinutes: boolean;
}

const defaultStyle: AspectTableStyle = {
  useSignSymbols: false,
  usePlanetSymbols: false,
  useAspectSymbols: true,
  useSignText: true,
  signSymbolFirst: true,
  degreesFirst: false,
  showMinutes: true,
};

export default function AspectTable({
  aspectChart,
  title,
  style = {},
  name1 = "chart 1",
  name2 = "chart 2",
}: {
  aspectChart: AspectWithPositions[];
  title: string;
  style?: Partial<AspectTableStyle>;
  name1?: string;
  name2?: string;
}) {
  const usedStyle = { ...defaultStyle, ...style };

  const formatSign = (sign: SignIndex): string => {
    const signName = signNumberToSignName(sign);
    const symbol = usedStyle.useSignSymbols ? signSymbols[signName] : "";
    const text = usedStyle.useSignText ? translateSign(signName) : "";
    const space = usedStyle.useSignSymbols && usedStyle.useSignText ? " " : "";
    if (usedStyle.signSymbolFirst) {
      return symbol + space + text;
    }
    return text + space + symbol;
  };

  const formatPlanet = (pos: CelestialObjectPosition): string => {
    return usedStyle.usePlanetSymbols
      ? ((planetSymbols as Record<string, string>)[pos.name] ??
          translatePlanet(pos))
      : translatePlanet(pos);
  };

  const formatAspect = (aspect: AspectName): string => {
    return usedStyle.useAspectSymbols ? aspectSymbols[aspect] : aspect;
  };

  const aspectColor = (aspect: AspectWithPositions): string => {
    let color = { r: 255, g: 255, b: 255 };
    switch (aspect.name) {
      case "conjunction":
        color = { r: 255, g: 255, b: 0 };
        break;
      case "opposition":
        color = { r: 0, g: 255, b: 0 };
        break;
      case "trine":
        color = { r: 0, g: 170, b: 255 };
        break;
      case "square":
        color = { r: 255, g: 60, b: 80 };
        break;
      case "sextile":
        color = { r: 90, g: 150, b: 255 };
        break;
      default:
        color = { r: 255, g: 255, b: 255 };
    }
    const lighten = (Math.min(aspect.orb, 8) / 8) * 225;
    color = {
      r: Math.min(255, color.r + lighten),
      g: Math.min(255, color.g + lighten),
      b: Math.min(color.b + lighten),
    };
    return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
  };

  const sign = (pos: CelestialObjectPosition) => formatSign(pos.sign);
  const degrees = (pos: CelestialObjectPosition) => pos.degrees + "°";
  const secondField = usedStyle.degreesFirst ? degrees : sign;
  const thirdField = usedStyle.degreesFirst ? sign : degrees;

  return (
    <div>
      <table className="MyTable">
        <tbody>
          <tr>
            <td className="MyTableHeading" colSpan={8}>
              {title}
            </td>
          </tr>
          <tr>
            <td colSpan={2}>aspect/orb</td>
            <td className="MyTableSubHeading" colSpan={3}>
              {name1}
            </td>
            <td className="MyTableSubHeading" colSpan={3}>
              {name2}
            </td>
          </tr>
          {aspectChart.map((a) => (
            <tr
              key={a.name + a.pos1.name + a.pos2.name}
              style={{ backgroundColor: aspectColor(a) }}
            >
              <td className="AspectTable-Aspect">{formatAspect(a.name)}</td>
              <td>{a.orb.toFixed(1)}°</td>
              <td>{formatPlanet(a.pos1)}</td>
              <td>{secondField(a.pos1)}</td>
              <td>{thirdField(a.pos1)}</td>
              <td>{formatPlanet(a.pos2)}</td>
              <td>{secondField(a.pos2)}</td>
              <td>{thirdField(a.pos2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
