import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DateNavigation from "src/components/date/DateNavigation";
import ErrorMessage from "src/components/ui/ErrorMessage";
import { useSelectedBaseDate } from "src/hooks/useSelectedBaseDate";
import { useSelectedDate } from "src/hooks/useSelectedDate";
import { useStreamingTransits } from "src/hooks/useStreamingTransits";
import { useTitle } from "src/hooks/useTitle";
import { useAppDispatch } from "src/store/hooks";
import { setRefererOfEditPage } from "src/store/slices/uiSlice";
import { AspectWithPositions } from "src/types";

// Everything the transit pages have in common: the base record, the date
// controls and the transits computed for them - only the view of the resulting
// aspects differs, so the aspects are handed over to `children`.
//
// `editReferer` is the page to return to when a record is edited from here.
export default function TransitsPageFrame({
  editReferer,
  children,
}: {
  editReferer: string;
  children: (aspects: AspectWithPositions[]) => React.ReactNode;
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
      dispatch(setRefererOfEditPage(editReferer));
      navigate("/saved-data/0");
    }
  }, [
    navigate,
    dispatch,
    editReferer,
    isRecordsSuccess,
    savedDataList?.length,
  ]);

  const { timestamp: transitTimestamp } = useSelectedDate();

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
      {!isTransitsError && children(data)}
    </DateNavigation>
  );
}
