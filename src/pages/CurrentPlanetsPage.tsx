import { useTranslation } from "react-i18next";
import { useTitle } from "../utils/utils";
import ChartTable from "../components/ChartTable";
import { useCurrentPosition } from "../apiCalls/usePosition";

function CurrentPlanetsPage() {
  const { t } = useTranslation();
  useTitle(t("title.planets"));
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
          title={t("currentPlanets.title")}
          style={currentChartStyle}
        />
      </div>
    </>
  );
}

export default CurrentPlanetsPage;
