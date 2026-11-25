import { useTranslation } from "react-i18next";
import { useTitle } from "src/hooks/useTitle";
import ChartTable from "src/components/tables/ChartTable";
import DateNavigation from "src/components/date/DateNavigation";
import ErrorMessage from "src/components/ui/ErrorMessage";
import { useSelectedDate } from "src/hooks/useSelectedDate";
import { useStreamingPosition } from "src/hooks/useStreamingPosition";

const currentChartStyle = {
  degreesFirst: true,
  useSignSymbols: true,
  showMinutes: true,
  showSeconds: true,
  useSignText: false,
};

const chartContainerStyle = {
  display: "flex",
  justifyContent: "space-evenly",
  marginTop: "20px",
  flexWrap: "wrap",
} as const;

function CurrentPlanetsPage() {
  const { t } = useTranslation();
  useTitle(t("title.planets"));

  // The date is shared with the transit pages (no record is needed here,
  // so the date navigation is rendered without the record selector)
  const { timestamp } = useSelectedDate();
  const { data = [], isError } = useStreamingPosition({ timestamp });

  return (
    <DateNavigation showRecordSelect={false}>
      <ErrorMessage isError={isError} message={t("common.errorLoading")} />
      {!isError && (
        <div style={chartContainerStyle}>
          <ChartTable
            chart={data}
            title={t("currentPlanets.title")}
            style={currentChartStyle}
          />
        </div>
      )}
    </DateNavigation>
  );
}

export default CurrentPlanetsPage;
