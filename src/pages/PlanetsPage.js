import React from "react";

import { useTitle } from "../utils/utils";
import ChartTable from "../components/ChartTable";
import { useCurrentPosition } from "../apiCalls/usePosition";
import { translatePlanet } from "../utils/translations";

function PlanetsPage() {
  useTitle("Planets");
  const data = useCurrentPosition().map(item => ({...item, name: translatePlanet(item)}));

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

  return (
    <>
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
          title="Aktuální planety"
          style={currentChartStyle}
        />

      </div>
      
    </>
  );
}

export default PlanetsPage;
