import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/instrument-sans";
import "@fontsource/martian-mono/400.css";
import { ArmadaApp } from "./ArmadaApp";
import "./armada.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ArmadaApp />
  </StrictMode>,
);
