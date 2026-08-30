import { useTranslation } from "react-i18next";
import { useTitle } from "src/hooks/useTitle";
import ChartTable from "src/components/tables/ChartTable";
import { useGetPositionQuery } from "src/store/slices/ephemeridesSlice";
import { dateToApiUTC } from "src/utils/timeZones";
import ErrorMessage from "src/components/ui/ErrorMessage";
import { useBusy } from "src/hooks/useBusy";

function CurrentPlanetsPage() {
  const { t } = useTranslation();
  useTitle(t("title.planets"));

  // dateToApiUTC truncates to a minute granularity, so the cache key does not change every render
  const {
    data = [],
    isError,
    isFetching,
  } = useGetPositionQuery(dateToApiUTC(new Date()));
  useBusy(isFetching);

  const currentChartStyle = {
    degreesFirst: true,
    useSignSymbols: true,
    showMinutes: true,
    showSeconds: true,
    useSignText: false,
  };

  return (
    <>
      <ErrorMessage isError={isError} message={t("common.errorLoading")} />
      {!isError && (
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
      )}
    </>
  );
}

export default CurrentPlanetsPage;
