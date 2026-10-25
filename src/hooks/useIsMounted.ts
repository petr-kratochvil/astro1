import React from "react";

// Returns a stable getter telling whether the component is still mounted.
export function useIsMounted() {
  // the component is not mounted when the hook is run
  const isMounted = React.useRef(false);
  React.useEffect(() => {
    // in the effects phase, the component is already mounted
    isMounted.current = true;
    return () => {
      // in the cleanup phase, the component is unmounted
      isMounted.current = false;
    };
  }, []);
  return React.useCallback(() => isMounted.current, []);
}
