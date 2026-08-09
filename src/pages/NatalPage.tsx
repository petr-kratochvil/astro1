import React from "react";
import { useTranslation } from "react-i18next";

import { useTitle } from "src/hooks/useTitle";
import ChartTable from "src/components/tables/ChartTable";
import RecordSelect from "src/components/ui/RecordSelect";
import { usePosition } from "src/api/usePosition";
import { useNavigate } from "react-router-dom";
import { getSavedData, setRefererOfEditPage } from "src/utils/localStorage";
import { SavedDate } from "src/types";

function NatalPage() {
  const { t } = useTranslation();
  useTitle(t("title.planets"));

  const currentChartStyle = {
    degreesFirst: true,
    useSignSymbols: true,
    showMinutes: true,
    showSeconds: true,
    useSignText: false,
  };

  const navigate = useNavigate();
  const savedDataList = getSavedData();

  React.useEffect(() => {
    if (savedDataList.length === 0) {
      setRefererOfEditPage("/natal-planets");
      navigate("/saved-data/0");
    }
  }, [navigate, savedDataList.length]);

  const [selectedBaseDate, setSelectedBaseDate] = React.useState<
    number | undefined
  >(savedDataList.length > 0 ? 0 : undefined);

  const [baseDateJson, setBaseDateJson] = React.useState<SavedDate | undefined>(
    savedDataList.length > 0 ? savedDataList[0] : undefined
  );

  const data = usePosition(baseDateJson);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "15px 0px",
        }}
      >
        <RecordSelect
          records={savedDataList}
          value={selectedBaseDate}
          onChange={(index) => {
            setSelectedBaseDate(index);
            setBaseDateJson(savedDataList[index]);
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <ChartTable
          chart={data}
          title={t("natalPlanets.title")}
          style={currentChartStyle}
        />
      </div>
    </>
  );
}

export default NatalPage;
