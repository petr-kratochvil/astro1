import React from "react";

import { useTitle } from "../utils/utils";
import { getAspects } from "../localComputation/aspects";
import AspectTable from "../components/AspectTable";
import constants from "../constants";
// import { usePosition } from "../apiCalls/usePosition";

// const secondDate = {year: 1984, month: 6, day: 11, hour: 10};

function SynastryTablePage() {
  useTitle("Synastry");
  const aspects = getAspects(constants.chartDataPetr, constants.chartDataJitka);

  const style = { useSignSymbols: true, useSignText: false };

  // const dataSecond = usePosition(secondDate);
  // const aspects2 = getAspects(constants.chartDataPetr, dataPetrE);

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
          style={style}
        />
        {/* <AspectTable
          aspectChart={aspects2}
          title="Petr & PetrE - Synastry"
          name1="Petr"
          name2="Second"
          style={style}
        /> */}
      </div>
      
    </>
  );
}

export default SynastryTablePage;
