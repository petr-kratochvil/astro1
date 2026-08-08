import React from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useTitle } from "../utils/utils";
import TransitsBoxes from "../components/TrasitsBoxes";
import { getTransits } from "../apiCalls/getTransits";
import { getSavedData, setRefererOfEditPage } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import Hammer from "react-hammerjs-18";
import AspectTable from "../components/AspectTable";
import { AspectWithPositions, SavedDate } from "../types";
import { formatDateWithWeekday } from "../utils/formatting";
import { getLocale } from "../utils/language";

export default function TransitsPage({
  showAsTable = false,
}: {
  showAsTable?: boolean;
}) {
  useTitle();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const savedDataList = getSavedData();

  React.useEffect(() => {
    if (savedDataList.length === 0) {
      setRefererOfEditPage("/");
      navigate("/saved-data/0");
    }
  }, [navigate, savedDataList.length]);

  const [selectedBaseDateIndex, setSelectedBaseDateIndex] = React.useState<
    number | undefined
  >(savedDataList.length > 0 ? 0 : undefined);
  const options = savedDataList.map((item, index) => ({
    value: index,
    label: item.name,
  }));

  const [data, setData] = React.useState<AspectWithPositions[]>([]);
  const [baseDate, setBaseDate] = React.useState<SavedDate | undefined>(
    savedDataList[0]
  );
  const [, setPerson] = React.useState<string | undefined>(
    savedDataList[0]?.name
  );
  const [transitDate, setTransitDate] = React.useState(new Date());

  function callGetTransits(baseDate: SavedDate | undefined, transitDate: Date) {
    if (baseDate && transitDate) {
      const { lat, lon } = baseDate;
      getTransits(
        baseDate,
        transitDate,
        lat && lon ? { lat, lon } : undefined
      ).then((data) => setData(data));
    }
  }

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

  React.useEffect(
    () => callGetTransits(baseDate, transitDate),
    [baseDate, transitDate]
  );

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
    margin: "10px 0px",
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "15px 0px 10px 0px",
          }}
        >
          {t("common.selectRecord")} &nbsp;
          <select
            style={{ minWidth: "150px", minHeight: "30px", cursor: "pointer" }}
            value={selectedBaseDateIndex}
            onChange={(e) => {
              const index = Number(e.target.value);
              setSelectedBaseDateIndex(index);
              setBaseDate(savedDataList[index]);
              setPerson(savedDataList[index]?.name);
            }}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
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
        <div style={buttonsMenuStyle}>
          <ButtonGroup variant="outlined" size="small">
            <Button onClick={() => setTransitDate(addMonths(transitDate, -12))}>
              ◁&nbsp;{t("transits.year")}
            </Button>
            <Button onClick={() => setTransitDate(addMonths(transitDate, -1))}>
              ◁&nbsp;{t("transits.month")}
            </Button>
            <Button onClick={() => setTransitDate(new Date())}>
              &nbsp;&nbsp;{t("transits.today")}&nbsp;&nbsp;
            </Button>
            <Button onClick={() => setTransitDate(addMonths(transitDate, +1))}>
              {t("transits.month")}&nbsp;▷
            </Button>
            <Button onClick={() => setTransitDate(addMonths(transitDate, +12))}>
              {t("transits.year")}&nbsp;▷
            </Button>
          </ButtonGroup>
        </div>
        {showAsTable ? (
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
        )}
      </div>
    </Hammer>
  );
}
