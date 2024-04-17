import React from "react";

import { useTitle } from "../utils/utils";
import { getAspects } from "../localComputation/aspects";
import AspectTable from "../components/AspectTable";
import constants from "../constants";

function SynastryTablePage() {
  useTitle("Synastry");
  const aspects = getAspects(constants.chartDataPetr, constants.chartDataJitka);

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
          aspectChart={aspects}
          title="Petr & Jitka - Synastry"
          name1="Petr"
          name2="Jitka"
          style={style}
        />
      </div>
      
    </>
  );
}

export default SynastryTablePage;
