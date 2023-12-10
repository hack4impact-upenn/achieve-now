/**
 * A file for defining the global MUI theme used in the project.
 */
import { createTheme } from '@mui/material/styles';
import COLORS from './colors';
import 'typeface-hk-grotesk';

// https://github.com/hack4impact/chapter-website-template/blob/main/public/style.css
const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
      main: COLORS.primaryBlue,
    },
    secondary: {
      main: COLORS.secondarySeafoam,
    },
    text: {
      primary: COLORS.text,
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(','),
    h1: {
      fontWeight: 500,
      color: 'black',
    },
    h2: {
      fontWeight: 500,
      color: 'black',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          letterSpacing: '0.3px',
          lineHeight: '1.5',
        },
        h1: {
          fontWeight: 'bold !important',
        },
        h2: {
          fontSize: '38px !important',
          marginBottom: '32px !important',
        },
        h3: {
          fontWeight: 'bold !important',
          marginBottom: '10px',
        },
        h4: {
          fontWeight: 'bold !important',
        },
      },
    },
  },
});

export default theme;
