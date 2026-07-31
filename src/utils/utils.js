import React from "react";

export function useTitle(title) {
  const baseTitle = "Astro Transits";

  React.useEffect(() => {
    if (title) {
      document.title = title + " - " + baseTitle;
    } else {
      document.title = baseTitle;
    }
  }, [title]);
}
