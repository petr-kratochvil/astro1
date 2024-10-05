import React from "react";
import { useTitle } from "../utils/utils";
import TransitsBoxes from "../components/TrasitsBoxes";
import { getTransits } from "../apiCalls/getTransits";
import { getBaseDateJson, getSavedData } from "../utils/localStorage";

export default function TransitsPage() {
  useTitle();

  const savedDataList = getSavedData();
  const [selectedBaseDate, setSelectedBaseDate] = React.useState(
    savedDataList.length > 0 ? 0 : null
  );
  const options = savedDataList.map((item, index) => ({
    value: index,
    label: item.name,
  }));

  const [data, setData] = React.useState([]);
  const [baseDateJson, setBaseDateJson] = React.useState(
    savedDataList.length > 0 ? savedDataList[0] : null
  );
  const [person, setPerson] = React.useState(
    savedDataList.length > 0 ? savedDataList[0].name : null
  );
  const [transitDate, setTransitDate] = React.useState(new Date());

  function callGetTransits(baseDate, transitDate) {
    if (baseDate && transitDate) {
      getTransits(baseDate, transitDate).then((data) => setData(data));
    }
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

  const buttonsMenuStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "10px",
  };

  return (
    <div>
      <h1 style={{ color: "slateblue", textAlign: "center" }}>
        Tranzity
      </h1>
      <div style={{margin: '10px'}}>
        Vyberte záznam: &nbsp;
        <select
          style={{minWidth: '150px', minHeight: '30px'}}
          value={selectedBaseDate}
          onChange={(e) => {
            setSelectedBaseDate(e.target.value);
            setBaseDateJson(savedDataList[e.target.value]);
            setPerson(savedDataList[e.target.value].name);
            console.log('tady tady 1')
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
