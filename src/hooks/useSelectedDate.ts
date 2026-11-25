import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { setSelectedDateTimestamp } from "src/store/slices/uiSlice";
import { dateAddDays, dateAddMonths } from "src/utils/timeZones";

export function useSelectedDate() {
  const dispatch = useAppDispatch();
  const selectedDateTimestamp = useAppSelector(
    (s) => s.ui.selectedDateTimestamp
  );

  const addDays = (days: number) => {
    dispatch(
      setSelectedDateTimestamp(
        dateAddDays(new Date(selectedDateTimestamp), days).getTime()
      )
    );
  };

  const addMonths = (months: number) => {
    dispatch(
      setSelectedDateTimestamp(
        dateAddMonths(new Date(selectedDateTimestamp), months).getTime()
      )
    );
  };

  const setDate = (date: Date) => {
    dispatch(setSelectedDateTimestamp(date.getTime()));
  };

  return {
    timestamp: selectedDateTimestamp,
    setDate,
    addDays,
    addMonths,
  };
}
