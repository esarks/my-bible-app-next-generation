// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PlasmicRootProvider } from "@plasmicapp/loader-react";
import { PLASMIC } from "./components/plasmic-init";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <PlasmicRootProvider loader={PLASMIC}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PlasmicRootProvider>
);
