// main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ScrollToTop from "./components/Header/ScrollToTop";
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
      <App /> 
      </ThemeProvider>

    </BrowserRouter>
  </React.StrictMode>,
);
