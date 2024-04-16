import axios from "axios";
import React from "react";

import { getAspects } from "../localComputation/aspects";
import AspectTable from "../components/AspectTable";
import constants from "../constants";

function TransitsAndSynastryPage() {
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

  const aspects = getAspects(constants.chartDataPetr, constants.chartDataJitka);

  const moonFilter = (aspect) => aspect.planet1.name !== "Moon";
  const transitsPetr = getAspects(data, constants.chartDataPetr).filter(
    moonFilter
  );
  const transitsJitka = getAspects(data, constants.chartDataJitka).filter(
    moonFilter
  );


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
        className="smallFont"
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
      
    </>
  );
}

export default TransitsAndSynastryPage;
