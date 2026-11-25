import React from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Hammer from "react-hammerjs-18";
import RecordSelect from "src/components/ui/RecordSelect";
import { useSelectedBaseDate } from "src/hooks/useSelectedBaseDate";
import { useTransitDate } from "src/hooks/useTransitDate";
import { formatDateWithWeekday } from "src/utils/formatting";
import { getLocale } from "src/utils/language";

const buttonsMenuStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
};

const KEY_REPEAT_INTERVAL_MS = 40;

// Hammer's DIRECTION_LEFT / DIRECTION_RIGHT
const SWIPE_LEFT = 2;
const SWIPE_RIGHT = 4;

function allowKeyAdvance(lastKeyTimeRef: React.MutableRefObject<number>) {
  const now = performance.now();
  if (now - lastKeyTimeRef.current < KEY_REPEAT_INTERVAL_MS) {
    return false;
  }
  lastKeyTimeRef.current = now;
  return true;
}

// The date switching controls (shared by every page working with the selected
// date), wrapped around the page content: the swipe gesture and the arrow keys
// move the date as well, so they belong to the same component.
//
// The selected date itself lives in the store, so it is kept while navigating
// between the pages using this component.
export default function DateNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, i18n } = useTranslation();
  const {
    index: selectedBaseDateIndex,
    data: savedDataList,
    setIndex: setSelectedBaseDateIndex,
  } = useSelectedBaseDate();
  const {
    timestamp: selectedTimestamp,
    setDate,
    addDays,
    addMonths,
  } = useTransitDate();

  const lastKeyTimeRef = React.useRef(0);

  function navigateByKey(event: KeyboardEvent) {
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

  // The handler closes over the current date, but the document listener is
  // subscribed only once - so the listener reads the handler through a ref.
  const navigateByKeyRef = React.useRef(navigateByKey);
  React.useEffect(() => {
    navigateByKeyRef.current = navigateByKey;
  });

  React.useEffect(() => {
    const listener = (event: KeyboardEvent) => navigateByKeyRef.current(event);
    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

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
      case SWIPE_LEFT:
        addDays(+1);
        break;
      case SWIPE_RIGHT:
        addDays(-1);
        break;
      default:
        break;
    }
  }

  return (
    <Hammer onSwipe={handleSwipe}>
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
                new Date(selectedTimestamp),
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

        {children}
      </div>
    </Hammer>
  );
}
