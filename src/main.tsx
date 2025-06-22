import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PlasmicRootProvider } from "@plasmicapp/loader-react";
import { PLASMIC } from "./plasmic-init";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PlasmicRootProvider loader={PLASMIC}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PlasmicRootProvider>
  </React.StrictMode>
);
