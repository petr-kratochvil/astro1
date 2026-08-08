import React from "react";
import { useTranslation } from "react-i18next";

import { useTitle } from "../utils/utils";
import ChartTable from "../components/ChartTable";
import { usePosition } from "../apiCalls/usePosition";
import { useNavigate } from "react-router-dom";
import { getSavedData, setRefererOfEditPage } from "../utils/localStorage";
import { SavedDate } from "../types";

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

  const options = savedDataList.map((item, index) => ({
    value: index,
    label: item.name,
  }));

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
        {t("common.selectRecord")} &nbsp;
        <select
          style={{ minWidth: "150px", minHeight: "30px", cursor: "pointer" }}
          value={selectedBaseDate}
          onChange={(e) => {
            const index = Number(e.target.value);
            setSelectedBaseDate(index);
            setBaseDateJson(savedDataList[index]);
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
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
          title={t("natalPlanets.title")}
          style={currentChartStyle}
        />
      </div>
    </>
  );
}

export default NatalPage;
