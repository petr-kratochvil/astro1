import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { useGetSavedDataQuery } from "src/store/slices/savedDataSlice";
import { selectBaseDate } from "src/store/slices/uiSlice";

export function useSelectedBaseDate() {
  const dispatch = useAppDispatch();
  const stored = useAppSelector((s) => s.ui.selectedBaseDateIndex);
  const { data = [], isSuccess, isError } = useGetSavedDataQuery();

  // Defensive: if index is out of bound, use 0 default
  const index = stored < data.length ? stored : 0;

  return {
    index,
    data,
    isSuccess,
    isError,
    setIndex: (i: number) => dispatch(selectBaseDate(i)),
  };
}
