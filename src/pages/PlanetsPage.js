import axios from "axios";
import React from "react";

import ChartTable from "../components/ChartTable";
import constants from "../constants";

function PlanetsPage() {
  const [data, setData] = React.useState([]);

  const getCurrentPlanets = () => {

    // Call Ephemerides API for current planets:
    const date = new Date();
    const body = {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      hour: date.getUTCHours() + date.getUTCMinutes() / 60,
    };
    axios
      .post(`${constants.ephemeridesApiBase}/position`, body)
      .then((response) => {
        setData(
          response.data.map((planet) => ({
            ...planet,
            sign: constants.signList[planet.sign - 1],
          }))
        );
      });
  };

  React.useEffect(getCurrentPlanets, []);

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
