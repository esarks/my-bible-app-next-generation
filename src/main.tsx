import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PlasmicRootProvider } from "@plasmicapp/loader-react";
import { BrowserRouter } from "react-router-dom";
import { PLASMIC } from "./plasmic-init";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PlasmicRootProvider loader={PLASMIC}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PlasmicRootProvider>
  </React.StrictMode>
);
