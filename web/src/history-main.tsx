import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HistoryApp } from "./HistoryApp";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HistoryApp />
  </StrictMode>,
);
