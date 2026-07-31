import React from "react";

import { useTitle } from "../utils/utils";
import ChartTable from "../components/ChartTable";
import { usePosition } from "../apiCalls/usePosition";
import { translatePlanet } from "../utils/translations";
import { useNavigate } from "react-router-dom";
import { getSavedData, setRefererOfEditPage } from "../utils/localStorage";

function NatalPage() {
  useTitle("Planets");

  // const chartStyleP = {
  //   useSignSymbols: true,
  //   useSignText: false,
  //   usePlanetSymbols: true,
  //   degreesFirst: false,
  //   showMinutes: true,
  //   signSymbolFirst: false,
  // };

  // const chartStyleJ = {
  //   useSignSymbols: false,
  //   usePlanetSymbols: true,
  //   degreesFirst: true,
  //   showMinutes: false,
  // };

  const currentChartStyle = {
    degreesFirst: true,
    useSignSymbols: true,
    showMinutes: true,
    showSeconds: true,
    useSignText: false,
  };

  const navigate = useNavigate();
  const savedDataList = getSavedData();

  React.useEffect(() => {
    if (savedDataList.length === 0) {
      setRefererOfEditPage("/natal-planets");
      navigate("/saved-data/0");
    }
  }, [navigate, savedDataList.length]);

  const [selectedBaseDate, setSelectedBaseDate] = React.useState(
    savedDataList.length > 0 ? 0 : null
  );

  const [baseDateJson, setBaseDateJson] = React.useState(
    savedDataList.length > 0 ? savedDataList[0] : null
  );

  const data = usePosition(baseDateJson).map((item) => ({
    ...item,
    name: translatePlanet(item),
  }));

  const options = savedDataList.map((item, index) => ({
    value: index,
    label: item.name,
  }));

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "15px 0px",
        }}
      >
        Vyberte záznam: &nbsp;
        <select
          style={{ minWidth: "150px", minHeight: "30px", cursor: "pointer" }}
          value={selectedBaseDate}
          onChange={(e) => {
            setSelectedBaseDate(e.target.value);
            setBaseDateJson(savedDataList[e.target.value]);
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div
        width="100%"
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "40px",
          flexWrap: "wrap",
        }}
      >
        <ChartTable
          chart={data}
          title="Nativní planety"
          style={currentChartStyle}
        />
      </div>
    </>
  );
}

export default NatalPage;
