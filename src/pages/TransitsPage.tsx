import React from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useNavigate } from "react-router-dom";
import Hammer from "react-hammerjs-18";
import TransitsBoxes from "src/components/transits/TrasitsBoxes";
import AspectTable from "src/components/tables/AspectTable";
import RecordSelect from "src/components/ui/RecordSelect";
import { useTitle } from "src/hooks/useTitle";
import { useAppDispatch } from "src/store/hooks";
import { setRefererOfEditPage } from "src/store/slices/uiSlice";
import { formatDateWithWeekday } from "src/utils/formatting";
import { getLocale } from "src/utils/language";
import ErrorMessage from "src/components/ui/ErrorMessage";
import { useSelectedBaseDate } from "src/hooks/useSelectedBaseDate";
import { useTransitDate } from "src/hooks/useTransitDate";
import { useStreamingTransits } from "src/hooks/useStreamingTransits";

const buttonsMenuStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
};

const KEY_REPEAT_INTERVAL_MS = 40;

function allowKeyAdvance(lastKeyTimeRef: React.MutableRefObject<number>) {
  const now = performance.now();
  if (now - lastKeyTimeRef.current < KEY_REPEAT_INTERVAL_MS) {
    return false;
  }
  lastKeyTimeRef.current = now;
  return true;
}

export default function TransitsPage({
  showAsTable = false,
}: {
  showAsTable?: boolean;
}) {
  const { t, i18n } = useTranslation();
  useTitle();
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
      dispatch(setRefererOfEditPage("/"));
      navigate("/saved-data/0");
    }
  }, [navigate, dispatch, isRecordsSuccess, savedDataList?.length]);

  const {
    timestamp: transitTimestamp,
    setDate,
    addDays,
    addMonths,
  } = useTransitDate();

  // The date label always shows the requested day, the page shows the last
  // response that arrived (if they differ, the loading indicator is on)
  const { data = [], isError: isTransitsError } = useStreamingTransits({
    baseDateIndex: selectedBaseDateIndex,
    transitTimestamp,
    skip: !recordsLoaded,
  });

  const lastKeyTimeRef = React.useRef(0);

  function handleKeyDown(event: KeyboardEvent) {
    if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
      if (event.repeat && !allowKeyAdvance(lastKeyTimeRef)) {
        return;
      }
      if (event.ctrlKey || event.altKey) {
        addMonths(event.key === "ArrowLeft" ? -1 : +1);
      } else {
        addDays(event.key === "ArrowLeft" ? -1 : +1);
      }
    }
  }

  function controlsContainerHandleKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>
  ) {
    if (
      event.key === "Enter" &&
      event.repeat &&
      !allowKeyAdvance(lastKeyTimeRef)
    ) {
      event.preventDefault();
    }
  }

  function handleSwipe(param: { direction: number }) {
    switch (param.direction) {
      case 2:
        addDays(+1);
        break;
      case 4:
        addDays(-1);
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

  if (isRecordsError) {
    return <ErrorMessage message={t("common.errorLoadingRecords")} />;
  }
  if (!recordsLoaded) {
    return null;
  }

  return (
    <Hammer onSwipe={handleSwipe} id="transitsBoxesArea">
      <div>
        {/* A handler to throttle key repeat (the element itself stays non-interactive) */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          className="controls-container"
          onKeyDown={controlsContainerHandleKeyDown}
        >
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
            <Button variant="outlined" onClick={() => addDays(-1)}>
              ◁◁
            </Button>
            <div
              style={{
                fontSize: "medium",
                minWidth: "130px",
                textAlign: "center",
              }}
            >
              {formatDateWithWeekday(
                new Date(transitTimestamp),
                getLocale(i18n.language)
              )}
            </div>
            <Button variant="outlined" onClick={() => addDays(+1)}>
              ▷▷
            </Button>
          </div>

          {/* 3) Five date switching buttons */}
          <div style={buttonsMenuStyle} className="timeShiftButtons">
            <ButtonGroup variant="outlined">
              <Button onClick={() => addMonths(-12)}>
                ◁&nbsp;{t("transits.year")}
              </Button>
              <Button onClick={() => addMonths(-1)}>
                ◁&nbsp;{t("transits.month")}
              </Button>
              <Button onClick={() => setDate(new Date())}>
                &nbsp;&nbsp;{t("transits.today")}&nbsp;&nbsp;
              </Button>
              <Button onClick={() => addMonths(+1)}>
                {t("transits.month")}&nbsp;▷
              </Button>
              <Button onClick={() => addMonths(+12)}>
                {t("transits.year")}&nbsp;▷
              </Button>
            </ButtonGroup>
          </div>
        </div>

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
      </div>
    </Hammer>
  );
}
