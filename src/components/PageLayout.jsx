// src/components/PageLayout.tsx
import { PlasmicComponent } from "@plasmicapp/loader-react";
import { Outlet } from "react-router-dom";

export default function PageLayout() {
  return (
    <>
      <PlasmicComponent component="PageLayout" />
      <Outlet />
    </>
  );
}
