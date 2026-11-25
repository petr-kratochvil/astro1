import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import TransitsBoxes from "src/components/transits/TrasitsBoxes";
import AspectTable from "src/components/tables/AspectTable";
import DateNavigation from "src/components/date/DateNavigation";
import { useTitle } from "src/hooks/useTitle";
import { useAppDispatch } from "src/store/hooks";
import { setRefererOfEditPage } from "src/store/slices/uiSlice";
import ErrorMessage from "src/components/ui/ErrorMessage";
import { useSelectedBaseDate } from "src/hooks/useSelectedBaseDate";
import { useTransitDate } from "src/hooks/useTransitDate";
import { useStreamingTransits } from "src/hooks/useStreamingTransits";

export default function TransitsPage({
  showAsTable = false,
}: {
  showAsTable?: boolean;
}) {
  const { t } = useTranslation();
  useTitle();
  const {
    index: selectedBaseDateIndex,
    data: savedDataList,
    isSuccess: isRecordsSuccess,
    isError: isRecordsError,
  } = useSelectedBaseDate();
  const recordsLoaded = isRecordsSuccess && savedDataList.length > 0;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (isRecordsSuccess && savedDataList.length === 0) {
      dispatch(setRefererOfEditPage("/"));
      navigate("/saved-data/0");
    }
  }, [navigate, dispatch, isRecordsSuccess, savedDataList?.length]);

  const { timestamp: transitTimestamp } = useTransitDate();

  // The date label always shows the requested day, the page shows the last
  // response that arrived (if they differ, the loading indicator is on)
  const { data = [], isError: isTransitsError } = useStreamingTransits({
    baseDateIndex: selectedBaseDateIndex,
    transitTimestamp,
    skip: !recordsLoaded,
  });

  if (isRecordsError) {
    return <ErrorMessage message={t("common.errorLoadingRecords")} />;
  }
  if (!recordsLoaded) {
    return null;
  }

  return (
    <DateNavigation>
      <ErrorMessage
        isError={isTransitsError}
        message={t("common.errorLoading")}
      />
      {!isTransitsError &&
        (showAsTable ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              marginTop: "20px",
              flexWrap: "wrap",
            }}
            className="smallFont"
          >
            <AspectTable
              aspectChart={data}
              title=""
              name1={t("transits.transiting")}
              name2={t("transits.natal")}
              style={{ useSignSymbols: true, useSignText: false }}
            />
          </div>
        ) : (
          <TransitsBoxes data={data} />
        ))}
    </DateNavigation>
  );
}
