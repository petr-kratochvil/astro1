import React from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useNavigate } from "react-router-dom";
import Hammer from "react-hammerjs-18";
import { SavedDate } from "src/types";
import TransitsBoxes from "src/components/transits/TrasitsBoxes";
import AspectTable from "src/components/tables/AspectTable";
import RecordSelect from "src/components/ui/RecordSelect";
import { useTitle } from "src/hooks/useTitle";
import { useGetTransitsQuery } from "src/store/ephemeridesSlice";
import { useGetSavedDataQuery } from "src/store/savedDataSlice";
import { setRefererOfEditPage } from "src/utils/localStorage";
import { formatDateWithWeekday } from "src/utils/formatting";
import { getLocale } from "src/utils/language";
import { dateToApiUTC } from "src/utils/timeZones";
import ErrorMessage from "src/components/ui/ErrorMessage";

export default function TransitsPage({
  showAsTable = false,
}: {
  showAsTable?: boolean;
}) {
  useTitle();
  const navigate = useNavigate();
  const { data: savedDataList, isSuccess } = useGetSavedDataQuery();

  React.useEffect(() => {
    if (isSuccess && savedDataList.length === 0) {
      setRefererOfEditPage("/");
      navigate("/saved-data/0");
    }
  }, [navigate, isSuccess, savedDataList?.length]);

  if (!isSuccess || savedDataList.length === 0) {
    return null;
  }

  return (
    <TransitsView savedDataList={savedDataList} showAsTable={showAsTable} />
  );
}

interface TransitsViewProps {
  savedDataList: SavedDate[];
  showAsTable: boolean;
}

function TransitsView({ savedDataList, showAsTable }: TransitsViewProps) {
  const { t, i18n } = useTranslation();

  const [selectedBaseDateIndex, setSelectedBaseDateIndex] = React.useState(0);
  const [transitDate, setTransitDate] = React.useState(new Date());

  // dateToApiUTC truncates to a minute granularity, so the cache key does not change every render
  const { data = [], isError } = useGetTransitsQuery({
    index: selectedBaseDateIndex,
    transitDate: dateToApiUTC(transitDate),
  });

  function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
        setTransitDate(addDays(transitDate, -1));
        break;
      case "ArrowRight":
        setTransitDate(addDays(transitDate, +1));
        break;
      default:
        break;
    }
  }

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const buttonsMenuStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  };

  function handleSwipe(param: { direction: number }) {
    switch (param.direction) {
      case 2:
        setTransitDate((prevDate) => addDays(prevDate, +1));
        break;
      case 4:
        setTransitDate((prevDate) => addDays(prevDate, -1));
        break;
      default:
        break;
    }
  }

  return (
    <Hammer onSwipe={handleSwipe} id="transitsBoxesArea">
      <div>
        <div className="controls-container">
          {/* 1) RecordSelect */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <RecordSelect
              records={savedDataList}
              value={selectedBaseDateIndex}
              onChange={(index) => setSelectedBaseDateIndex(index)}
            />
          </div>

          {/* 2) Day switch buttons + formatted date */}
          <div style={{ ...buttonsMenuStyle, gap: "12px" }}>
            <Button
              variant="outlined"
              onClick={() => setTransitDate(addDays(transitDate, -1))}
            >
              ◁◁
            </Button>
            <div
              style={{
                fontSize: "medium",
                minWidth: "130px",
                textAlign: "center",
              }}
            >
              {formatDateWithWeekday(transitDate, getLocale(i18n.language))}
            </div>
            <Button
              variant="outlined"
              onClick={() => setTransitDate(addDays(transitDate, +1))}
            >
              ▷▷
            </Button>
          </div>

          {/* 3) Five date switching buttons */}
          <div style={buttonsMenuStyle} className="timeShiftButtons">
            <ButtonGroup variant="outlined">
              <Button
                onClick={() => setTransitDate(addMonths(transitDate, -12))}
              >
                ◁&nbsp;{t("transits.year")}
              </Button>
              <Button
                onClick={() => setTransitDate(addMonths(transitDate, -1))}
              >
                ◁&nbsp;{t("transits.month")}
              </Button>
              <Button onClick={() => setTransitDate(new Date())}>
                &nbsp;&nbsp;{t("transits.today")}&nbsp;&nbsp;
              </Button>
              <Button
                onClick={() => setTransitDate(addMonths(transitDate, +1))}
              >
                {t("transits.month")}&nbsp;▷
              </Button>
              <Button
                onClick={() => setTransitDate(addMonths(transitDate, +12))}
              >
                {t("transits.year")}&nbsp;▷
              </Button>
            </ButtonGroup>
          </div>
        </div>

        <ErrorMessage isError={isError} message={t("common.errorLoading")} />
        {!isError &&
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
      </div>
    </Hammer>
  );
}
