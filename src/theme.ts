import { createTheme } from "@mui/material/styles";
import { buttonGroupClasses } from "@mui/material/ButtonGroup";

// #6a5acd on white is 5.3:1, so `contrastText` resolves to white (WCAG AA).
// Also called slateblue or rgb(106, 90, 205)
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
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          // In a horizontal outlined group every button but the last hides its
          // right border (the neighbour's left one shows instead) and MUI paints
          // it back on :hover. Touch browsers leave :hover stuck on the element
          // last tapped, so that divider stayed visible after each tap. Restrict
          // the effect to devices that can actually hover.
          "@media (hover: none)": {
            // `&&` doubles the root class so this outranks MUI's own rule
            // regardless of stylesheet order.
            [`&& .${buttonGroupClasses.firstButton}:hover, && .${buttonGroupClasses.middleButton}:hover`]:
              {
                borderRightColor: "transparent",
              },
          },
        },
      },
    },
  },
});

export default theme;
