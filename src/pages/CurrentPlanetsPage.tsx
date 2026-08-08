import { useTitle } from "../utils/utils";
import ChartTable from "../components/ChartTable";
import { useCurrentPosition } from "../apiCalls/usePosition";

function CurrentPlanetsPage() {
  useTitle("Planets");
  const data = useCurrentPosition();

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

export default CurrentPlanetsPage;
