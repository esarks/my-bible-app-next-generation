import * as React from "react";
import { Outlet } from "react-router-dom";
import { PlasmicPageLayout } from "../plasmic/app_starter/PlasmicPageLayout";

export default function PageLayout() {
  return <PlasmicPageLayout children={<Outlet />} />;
}
