import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TreasuryApp } from "./TreasuryApp";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TreasuryApp />
  </StrictMode>,
);
