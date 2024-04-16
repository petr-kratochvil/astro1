import axios from "axios";
import React from "react";

import { getAspects } from "../localComputation/aspects";
import AspectTable from "../components/AspectTable";
import ChartTable from "../components/ChartTable";
import constants from "../constants";

const parse = (currentPlanets) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(currentPlanets, "text/html");
  const table = document.getElementsByTagName("table")[0].children[0].children;
  const result = [];
  for (let i = 1; i <= 12; i++) {
    const tr = table[i];
    const name = tr.children[1].innerHTML;
    const degrees = tr.children[2].innerHTML;
    const sign = tr.children[3].children[0].alt;
    const minutesSecondsRetrograde = tr.children[4].innerHTML;
    const split1 = minutesSecondsRetrograde.split("'");
    const split2 = split1[1].split('"');
    const minutes = split1[0];
    const seconds = split2[0];
    const retrograde = split2[1] === "r";
    result.push({ name, degrees, sign, minutes, seconds, retrograde });
  }
  return result;
};

function Page1() {
  const [data, setData] = React.useState([]);

  const getCurrentPlanets = () => {
    // Call astro.com:
    // axios.get(constants.getPlanetsUrl).then((response) => {
    //   console.log('got PLANETS response:');
    //   console.log(response.data);
    //   setData(parse(response.data));
    // });

    // Use constant data
    // setData(parse(constants.currentPlanetsConst));

    // Call Ephemerides API:
    const date = new Date();
    const body = {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      hour: date.getUTCHours() + date.getUTCMinutes() / 60,
    };
    console.log(body);
    axios
      .post(`${constants.ephemeridesApiBase}/position`, body)
      .then((response) => {
        console.log("got PLANETS response:");
        console.log(response.data);
        setData(
          response.data.map((planet) => ({
            ...planet,
            sign: constants.signList[planet.sign - 1],
          }))
        );
      });
  };

  const getChart = () => {
    axios.get(constants.getChartUrl).then((response) => {
      console.log("got CHART response:");
      console.log(response.data);
      // const div = document.createElement('div');
      // div.innerHTML = response.data;
      document.getElementById("chartElement").innerHTML = response.data;
      const image =
        document.getElementById("chartElement").children[1].children[0];
      console.log(image);
      image.src = "http://astro.com" + image.src.substring(21);
    });
  };

  React.useEffect(getCurrentPlanets, []);

  const aspects = getAspects(constants.chartDataPetr, constants.chartDataJitka);

  const moonFilter = (aspect) => aspect.planet1.name !== "Moon";
  const transitsPetr = getAspects(data, constants.chartDataPetr).filter(
    moonFilter
  );
  const transitsJitka = getAspects(data, constants.chartDataJitka).filter(
    moonFilter
  );

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
      <div
        width="100%"
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <AspectTable
          aspectChart={aspects}
          title="Petr & Jitka - Synastry"
          name1="Petr"
          name2="Jitka"
        />
        <AspectTable
          aspectChart={transitsPetr}
          title="Petr's Transits"
          name1="Current planets"
          name2="Petr"
        />
        <AspectTable
          aspectChart={transitsJitka}
          title="Jitka's Transits"
          name1="Current planets"
          name2="Jitka"
        />
      </div>
      <div id="chartElement" style={{ margin: "20px" }}></div>
    </>
  );
}

export default Page1;
