import React from "react";
import { useTranslation } from "react-i18next";

import { useTitle } from "src/hooks/useTitle";
import ChartTable from "src/components/tables/ChartTable";
import RecordSelect from "src/components/ui/RecordSelect";
import { useGetNatalPositionQuery } from "src/store/ephemeridesSlice";
import { useGetSavedDataQuery } from "src/store/savedDataSlice";
import { useNavigate } from "react-router-dom";
import { setRefererOfEditPage } from "src/utils/localStorage";
import { SavedDate } from "src/types";
import ErrorMessage from "src/components/ui/ErrorMessage";

function NatalPage() {
  const { t } = useTranslation();
  useTitle(t("title.planets"));

  const navigate = useNavigate();
  const { data: savedDataList, isSuccess } = useGetSavedDataQuery();

  React.useEffect(() => {
    if (isSuccess && savedDataList.length === 0) {
      setRefererOfEditPage("/natal-planets");
      navigate("/saved-data/0");
    }
  }, [navigate, isSuccess, savedDataList?.length]);

  if (!isSuccess || savedDataList.length === 0) {
    return null;
  }

  return <NatalView savedDataList={savedDataList} />;
}

function NatalView({ savedDataList }: { savedDataList: SavedDate[] }) {
  const { t } = useTranslation();
  const [selectedBaseDateIndex, setSelectedBaseDateIndex] = React.useState(0);

  const { data = [], isError } = useGetNatalPositionQuery(
    selectedBaseDateIndex
  );

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
          justifyContent: "center",
          alignItems: "center",
          margin: "15px 0px",
        }}
      >
        <RecordSelect
          records={savedDataList}
          value={selectedBaseDateIndex}
          onChange={(index) => setSelectedBaseDateIndex(index)}
        />
      </div>

      <ErrorMessage isError={isError} message={t("common.errorLoading")} />
      {!isError && (
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
      )}
    </>
  );
}

export default NatalPage;
