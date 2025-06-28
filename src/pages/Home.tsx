// src/pages/Home.tsx
import React from "react";
import PageLayoutWrapper from "../components/PageLayoutWrapper";
import { PlasmicComponent } from "@plasmicapp/loader-react";

export default function Home() {
  return (
    <PageLayoutWrapper>
      <PlasmicComponent component="Homepage" />
    </PageLayoutWrapper>
  );
}
