import React from "react";

// Returns a stable getter telling whether the component is still mounted.
export function useIsMounted() {
  const isMounted = React.useRef(true);
  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return React.useCallback(() => isMounted.current, []);
}
