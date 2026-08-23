import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { setTransitDateTimestamp } from "src/store/slices/uiSlice";
import { dateAddDays, dateAddMonths } from "src/utils/timeZones";

export function useTransitDate() {
  const dispatch = useAppDispatch();
  const transitDateTimestamp = useAppSelector((s) => s.ui.transitDateTimestamp);

  const addDays = (days: number) => {
    dispatch(
      setTransitDateTimestamp(
        dateAddDays(new Date(transitDateTimestamp), days).getTime()
      )
    );
  };

  const addMonths = (months: number) => {
    dispatch(
      setTransitDateTimestamp(
        dateAddMonths(new Date(transitDateTimestamp), months).getTime()
      )
    );
  };

  const setDate = (date: Date) => {
    dispatch(setTransitDateTimestamp(date.getTime()));
  };

  return {
    date: new Date(transitDateTimestamp),
    setDate,
    addDays,
    addMonths,
  };
}
