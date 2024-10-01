import axios from "axios";
import React from "react";
import { useTitle } from "../utils/utils";
import TransitsBoxes from "../components/TrasitsBoxes";
import { getTransits } from "../apiCalls/getTransits";

export default function TransitsPage() {
  useTitle();
  const [data, setData] = React.useState([]);
  const baseDatePetr = { year: 1988, month: 7, day: 12, hour: 2 };
  const baseDateJitka = { year: 1973, month: 3, day: 26, hour: 2.25 };
  const [baseDateJson, setBaseDateJson] = React.useState(baseDatePetr);
  const [person, setPerson] = React.useState("Petr");
  const [transitDate, setTransitDate] = React.useState(new Date());

  function callGetTransits(baseDate, transitDate) {
    getTransits(baseDate, transitDate).then(data => setData(data));
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
    () => callGetTransits(baseDateJson, transitDate),
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
      <TransitsBoxes data={data} />
    </div>
  );
}
