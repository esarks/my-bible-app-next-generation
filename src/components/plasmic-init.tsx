
// src/plasmic-init.ts
import { initPlasmicLoader } from "@plasmicapp/loader-react";
import { logger } from "../lib/logger";

const projectId = import.meta.env.PLASMIC_PROJECT_ID as string | undefined;
const publicToken = import.meta.env.PLASMIC_PUBLIC_TOKEN as string | undefined;

if (!projectId || !publicToken) {
  logger.error(
    "Plasmic credentials are missing. Please set PLASMIC_PROJECT_ID and PLASMIC_PUBLIC_TOKEN."
  );
}

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: projectId ?? "",
      token: publicToken ?? "",
    },
  ],
  preview: true,
});
