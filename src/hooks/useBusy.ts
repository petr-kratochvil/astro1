import React from "react";
import { useAppDispatch } from "src/store/hooks";
import { startBusy, endBusy } from "src/store/slices/loadingSlice";

// Report that this component is waiting for data
// The loadingSlice is collecting these reports
export function useBusy(isBusy: boolean) {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!isBusy) {
      return;
    }
    dispatch(startBusy());
    return () => {
      dispatch(endBusy());
    };
  }, [dispatch, isBusy]);
}
