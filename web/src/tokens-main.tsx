import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TokensApp } from "./TokensApp";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TokensApp />
  </StrictMode>,
);
