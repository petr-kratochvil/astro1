import React from "react";

import { useTitle } from "../utils/utils";
import ChartTable from "../components/ChartTable";
import constants from "../constants";
import useCurrentPosition from "../apiCalls/usePosition";

function PlanetsPage() {
  useTitle("Planets");
  const data = useCurrentPosition();

  const chartStyleP = {
    useSignSymbols: true,
    useSignText: false,
    usePlanetSymbols: true,
    degreesFirst: false,
    showMinutes: true,
    signSymbolFirst: false,
  };

  const chartStyleJ = {
    useSignSymbols: false,
    usePlanetSymbols: true,
    degreesFirst: true,
    showMinutes: false,
  };

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
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <ChartTable
          chart={data}
          title="Current planets"
          style={currentChartStyle}
        />
        <ChartTable
          chart={constants.chartDataPetr}
          title="Petr Kratochvíl"
          style={chartStyleP}
        />
        <ChartTable
          chart={constants.chartDataJitka}
          title="Jitka Kratochvílová"
          style={chartStyleJ}
        />
      </div>
      
    </>
  );
}

export default PlanetsPage;
