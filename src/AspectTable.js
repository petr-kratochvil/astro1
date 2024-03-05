import { aspectSymbols, planetSymbols, signSymbols } from "./constants";

const defaultStyle = {
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
}) {
  const usedStyle = { ...defaultStyle, ...style };

  const formatSign = (sign) => {
    const symbol = usedStyle.useSignSymbols ? signSymbols[sign] : "";
    const text = usedStyle.useSignText ? sign : "";
    const space = usedStyle.useSignSymbols && usedStyle.useSignText ? " " : "";
    if (usedStyle.signSymbolFirst) {
      return symbol + space + text;
    }
    return text + space + symbol;
  };

  const formatPlanet = (planet) => {
    return usedStyle.usePlanetSymbols ? planetSymbols[planet] : planet;
  };

  const formatAspect = (aspect) => {
    return usedStyle.useAspectSymbols ? aspectSymbols[aspect] : aspect;
  };

  const aspectColor = (aspect) => {
    let color = { r: 255, g: 255, b: 255 };
    switch (aspect.aspect) {
      case "Conjunction":
        color = { r: 255, g: 255, b: 0 };
        break;
      case "Opposition":
        color = { r: 0, g: 255, b: 0 };
        break;
      case "Trine":
        color = { r: 0, g: 170, b: 255 };
        break;
      case "Square":
        color = { r: 255, g: 60, b: 80 };
        break;
      case "Sextile":
        color = { r: 90, g: 150, b: 255 };
        break;
      default:
        color = { r: 0, g: 0, b: 0 };
    }
    const lighten = (Math.min(aspect.orb, 8) / 8) * 225;
    color = {
      r: Math.min(255, color.r + lighten),
      g: Math.min(255, color.g + lighten),
      b: Math.min(color.b + lighten),
    };
    return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
  };

  const sign = (a) => formatSign(a.sign);
  const degrees = (a) => a.degrees + "°";
  const secondField = usedStyle.degreesFirst ? degrees : sign;
  const thirdField = usedStyle.degreesFirst ? sign : degrees;

  return (
    <div>
      <table className="MyTable">
        <tbody>
          <tr>
            <td className="MyTableHeading" colSpan="8">
              {title}
            </td>
          </tr>
          <tr>
            <td colSpan="2">aspect/orb</td>
            <td className="MyTableSubHeading" colSpan="3">
              {name1}
            </td>
            <td className="MyTableSubHeading" colSpan="3">
              {name2}
            </td>
          </tr>
          {aspectChart.map((a) => (
            <tr
              key={a.aspect + a.planet1.name + a.planet2.name}
              style={{ backgroundColor: aspectColor(a) }}
            >
              <td className="AspectTable-Aspect">{formatAspect(a.aspect)}</td>
              <td>{a.orb.toFixed(1)}°</td>
              <td>{formatPlanet(a.planet1.name)}</td>
              <td>{secondField(a.planet1)}</td>
              <td>{thirdField(a.planet1)}</td>
              <td>{formatPlanet(a.planet2.name)}</td>
              <td>{secondField(a.planet2)}</td>
              <td>{thirdField(a.planet2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
