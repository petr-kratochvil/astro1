import { useTranslation } from "react-i18next";
import { useTitle } from "src/hooks/useTitle";
import StationsTable from "src/components/tables/StationsTable";
import { useGetStationsQuery } from "src/store/slices/ephemeridesSlice";
import { dateToApiUTC } from "src/utils/timeZones";
import ErrorMessage from "src/components/ui/ErrorMessage";
import { useBusy } from "src/hooks/useBusy";

const tablesStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: "40px",
  flexWrap: "wrap",
  gap: "20px",
} as const;

function StationsPage() {
  const { t } = useTranslation();
  useTitle(t("title.stations"));

  // dateToApiUTC truncates to a minute granularity, so the cache key does not change every render
  const {
    data = [],
    isError,
    isFetching,
  } = useGetStationsQuery(dateToApiUTC(new Date()));
  useBusy(isFetching);

  return (
    <>
      <ErrorMessage isError={isError} message={t("common.errorLoading")} />
      {!isError && (
        <div style={tablesStyle}>
          <StationsTable
            stations={data}
            direction="previous"
            title={t("stations.previous")}
          />
          <StationsTable
            stations={data}
            direction="next"
            title={t("stations.next")}
          />
        </div>
      )}
    </>
  );
}

export default StationsPage;
