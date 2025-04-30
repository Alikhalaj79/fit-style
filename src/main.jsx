import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/index.css";
import "./styles/fonts.css";
import { ThemeProvider } from "@mui/material";
import theme from "./mui/theme"; //custom theme from materialUI
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    {/* //Provide custom theme use material UI */}
    <ThemeProvider theme={theme}>
      {/* //Browser Router for routing web Pages using react router dom */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </>
);
