import React from "react";

import { getAspects } from "../localComputation/aspects";
import AspectTable from "../components/AspectTable";
import constants from "../constants";
import useCurrentPosition from "../apiCalls/usePosition";

function TransitsTablePage() {
  const data = useCurrentPosition();

  const moonFilter = (aspect) => aspect.planet1.name !== "Moon";
  const transitsPetr = getAspects(data, constants.chartDataPetr).filter(
    moonFilter
  );
  const transitsJitka = getAspects(data, constants.chartDataJitka).filter(
    moonFilter
  );

  const style = { useSignSymbols: true, useSignText: false };

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
          aspectChart={transitsPetr}
          title="Petr's Transits"
          name1="Current planets"
          name2="Petr"
          style={style}
        />
        <AspectTable
          aspectChart={transitsJitka}
          title="Jitka's Transits"
          name1="Current planets"
          name2="Jitka"
          style={style}
        />
      </div>
      
    </>
  );
}

export default TransitsTablePage;
