import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#34c466",
      dark: "#2ba355",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#637380",
      dark: "#4a5761",
      contrastText: "#ffffff",
    },
    success: {
      main: "#0d7730",
      light: "#d4f4dd",
    },
    error: {
      main: "#c41c1c",
      light: "#ffdddd",
    },
    grey: {
      100: "#f4f6f8",
      500: "#637380",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 700,
          fontSize: "1rem",
          padding: "12px 24px",
          minHeight: "48px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#f4f6f8",
        },
      },
    },
  },
  typography: {
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
  },
});
