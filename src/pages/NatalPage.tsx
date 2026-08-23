import React from "react";
import { useTranslation } from "react-i18next";

import { useTitle } from "src/hooks/useTitle";
import ChartTable from "src/components/tables/ChartTable";
import RecordSelect from "src/components/ui/RecordSelect";
import { useGetNatalPositionQuery } from "src/store/slices/ephemeridesSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "src/store/hooks";
import { setRefererOfEditPage } from "src/store/slices/uiSlice";
import ErrorMessage from "src/components/ui/ErrorMessage";
import { useSelectedBaseDate } from "src/hooks/useSelectedBaseDate";

const currentChartStyle = {
  degreesFirst: true,
  useSignSymbols: true,
  showMinutes: true,
  showSeconds: true,
  useSignText: false,
};

function NatalPage() {
  const { t } = useTranslation();
  useTitle(t("title.planets"));
  const {
    index: selectedBaseDateIndex,
    data: savedDataList,
    setIndex: setSelectedBaseDateIndex,
    isSuccess: isRecordsSuccess,
    isError: isRecordsError,
  } = useSelectedBaseDate();
  const recordsLoaded = isRecordsSuccess && savedDataList.length > 0;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (isRecordsSuccess && savedDataList.length === 0) {
      dispatch(setRefererOfEditPage("/natal-planets"));
      navigate("/saved-data/0");
    }
  }, [navigate, dispatch, isRecordsSuccess, savedDataList?.length]);

  const { data = [], isError: isNatalPositionError } = useGetNatalPositionQuery(
    selectedBaseDateIndex,
    { skip: !recordsLoaded }
  );

  if (isRecordsError) {
    return <ErrorMessage message={t("common.errorLoadingRecords")} />;
  }
  if (!recordsLoaded) {
    return null;
  }

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

      <ErrorMessage isError={isNatalPositionError} message={t("common.errorLoading")} />
      {!isNatalPositionError && (
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
