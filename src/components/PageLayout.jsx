import React from "react";
import { PlasmicPageLayout } from "../plasmic/app_starter/PlasmicPageLayout";
import { Outlet } from "react-router-dom";

export default function PageLayout() {
  return (
    <PlasmicPageLayout>
      <Outlet />
    </PlasmicPageLayout>
  );
}
