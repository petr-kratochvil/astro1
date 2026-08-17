import { alpha, createTheme, Theme } from "@mui/material/styles";
import { ButtonProps } from "@mui/material/Button";

// The app's own CSS (header, borders, table headings, headlines) is built
// around `slateblue`. Mirroring it into the MUI palette keeps MUI components
// on that accent instead of introducing MUI's default blue as a second one.
// #6a5acd on white is 5.3:1, so `contrastText` resolves to white (WCAG AA).
export const accent = "#6a5acd";

// MUI drives Button hover styling through CSS variables and only reassigns them
// inside `@media (hover: hover)`, so touch devices get no hover feedback at all
// - except ButtonGroup's divider border, whose own hover rule carries no such
// guard, which is why tapping a grouped button used to darken just its right
// edge. Re-emitting the very same assignments for touch restores the complete
// desktop hover instead. It stays on the tapped button until another element is
// tapped, which is the browser's normal sticky-hover behaviour.
function hoverVariables(theme: Theme, color: ButtonProps["color"]) {
  if (!color || color === "inherit") {
    return {};
  }
  const { main, dark } = theme.palette[color];
  return {
    "--variant-containedBg": dark,
    "--variant-textBg": alpha(main, theme.palette.action.hoverOpacity),
    "--variant-outlinedBorder": main,
    "--variant-outlinedBg": alpha(main, theme.palette.action.hoverOpacity),
  };
}

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
        root: ({ theme, ownerState }) => ({
          // Labels are user-facing prose in two languages; SHOUTING them adds
          // nothing and hurts Czech diacritics legibility.
          textTransform: "none",
          "@media (hover: none)": {
            "&:hover": hoverVariables(theme, ownerState.color),
          },
        }),
      },
    },
  },
});

export default theme;
