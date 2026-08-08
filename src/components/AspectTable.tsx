import { AspectWithPositions, CelestialObjectPosition } from "../types";
import {
  aspectColor,
  formatAspect,
  formatPlanet,
  formatSign,
  FormattingStyle,
} from "../utils/formatting";

const defaultStyle: FormattingStyle = {
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
  style?: Partial<FormattingStyle>;
  name1?: string;
  name2?: string;
}) {
  const usedStyle = { ...defaultStyle, ...style };

  const sign = (pos: CelestialObjectPosition) =>
    formatSign(pos.sign, usedStyle);
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
              <td className="AspectTable-Aspect">
                {formatAspect(a.name, usedStyle)}
              </td>
              <td>{a.orb.toFixed(1)}°</td>
              <td>{formatPlanet(a.pos1, usedStyle)}</td>
              <td>{secondField(a.pos1)}</td>
              <td>{thirdField(a.pos1)}</td>
              <td>{formatPlanet(a.pos2, usedStyle)}</td>
              <td>{secondField(a.pos2)}</td>
              <td>{thirdField(a.pos2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
