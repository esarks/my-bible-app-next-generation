// src/components/PageLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import PlasmicPageLayout from "../components/plasmic/my_bible_app_next_generation/PlasmicPageLayout";

export default function PageLayout() {
  return (
    <>
      <PlasmicPageLayout />
      <Outlet />
    </>
  );
}
