import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: `"Vazir" , "YekanBakh" , "Roboto" , "Arial"`,
    fontWeightLight: 100,
    fontWeightRegular: 200,
    fontWeightMedium: 300,
    fontWeightBold: 400,
    fontWeightHeavy: 600,
  },
  direction: "rtl",
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        },
        html: {
          margin: 0,
          padding: 0,
        },
      },
    },

    MuiContainer: {
      defaultProps: {
        disableGutters: true, // حذف پدینگ داخلی پیش‌فرض کانتینر
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

export default theme;