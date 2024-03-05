import { planetSymbols, signSymbols } from "./constants";

const defaultStyle = {
  useSignSymbols: false,
  usePlanetSymbols: false,
  useSignText: true,
  signSymbolFirst: true,
  degreesFirst: false,
  showMinutes: true,
  showSeconds: false,
};

export default function ChartTable({chart, title, style={}}) {
  const usedStyle = {...defaultStyle, ...style};

  const formatSign = (sign) => {
    const symbol = usedStyle.useSignSymbols? signSymbols[sign] : '';
    const text = usedStyle.useSignText ? sign: '';
    const space = usedStyle.useSignSymbols && usedStyle.useSignText ? ' ' : '';
    if (usedStyle.signSymbolFirst) {
      return symbol + space + text;
    }
    return text + space + symbol;
  };

  const formatPlanet = (planet) => {
    return usedStyle.usePlanetSymbols? planetSymbols[planet] : planet;
  }

  const sign = (a) => formatSign(a.sign);
  const degrees = (a) => a.degrees + '°';
  const secondField = usedStyle.degreesFirst? degrees: sign;
  const thirdField = usedStyle.degreesFirst? sign: degrees;

  return (
    
        <div>
          <table className="MyTable">
            <tbody>
              <tr>
                <td className="MyTableHeading" colSpan="6">{title}</td>
              </tr>
              {chart.map(a => <tr key={a.name}>
                <td>{formatPlanet(a.name)}</td>
                <td>{secondField(a)}</td>
                <td>{thirdField(a)}</td>
                {usedStyle.showMinutes? <td>{a.minutes}'</td> : ''}
                {usedStyle.showSeconds? <td>{a.seconds}'</td> : ''}
                <td>{a.retrograde ? 'r' : ''}</td>
                </tr>)}
            </tbody>
          </table>
        </div>
        
  );
}