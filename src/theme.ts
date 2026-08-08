import { createTheme } from "@mui/material/styles";

// The app's own CSS (header, borders, table headings, headlines) is built
// around `slateblue`. Mirroring it into the MUI palette keeps MUI components
// on that accent instead of introducing MUI's default blue as a second one.
// #6a5acd on white is 5.3:1, so `contrastText` resolves to white (WCAG AA).
export const accent = "#6a5acd";

const theme = createTheme({
  palette: {
    primary: {
      main: accent,
    },
  },
  // Matches the 8px radius already used by .PlanetBox and the saved-record rows.
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        // Flat buttons read as less dated than Material's default drop shadow.
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          // Labels are user-facing prose in two languages; SHOUTING them adds
          // nothing and hurts Czech diacritics legibility.
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;
