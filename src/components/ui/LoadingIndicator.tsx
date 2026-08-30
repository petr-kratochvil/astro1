import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppSelector } from "src/store/hooks";
import { selectIsBusy } from "src/store/slices/loadingSlice";

// Prevent flickers when waiting is short
const APPEAR_DELAY_MS = 30;

export default function LoadingIndicator() {
  const isBusy = useAppSelector(selectIsBusy);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (!isBusy) {
      return;
    }
    const timeoutId = window.setTimeout(
      () => setIsVisible(true),
      APPEAR_DELAY_MS
    );
    return () => {
      window.clearTimeout(timeoutId);
      setIsVisible(false);
    };
  }, [isBusy]);

  return (
    <div className="App-header-loading">
      <CircularProgress
        size={20}
        color="inherit"
        style={{ visibility: isVisible ? "visible" : "hidden" }}
      />
    </div>
  );
}
