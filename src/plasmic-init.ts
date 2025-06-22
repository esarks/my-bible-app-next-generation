// src/plasmic-init.ts
import { initPlasmicLoader } from "@plasmicapp/loader-react";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "kPtL4UpULb2Exm5C4cyhzL",      // e.g., "abc123"
      token: "OloXF2aF67tSsoOEJLmaqbUsPBgaC2evrguIgRwZ12zTKiORgoYrxrbZEZNAj6HA65vfknOmvsxHFHRFAwRTTg", // e.g., "xyz456"
    },
  ],
  preview: true, // true for dev environment
});
