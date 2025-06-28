import React from "react";
import PageLayoutWrapper from "../components/PageLayoutWrapper";
import { PlasmicComponent } from "@plasmicapp/loader-react";

export default function HomePage() {
  return (
    <PageLayoutWrapper>
      <PlasmicComponent component="Homepage" />
    </PageLayoutWrapper>
  );
}
