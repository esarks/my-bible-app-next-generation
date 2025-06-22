// src/components/PageLayoutWrapper.tsx
import * as React from "react";
import { PlasmicPageLayout } from "../plasmic/app_starter/PlasmicPageLayout";

export default function PageLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <PlasmicPageLayout>{children}</PlasmicPageLayout>;
}
