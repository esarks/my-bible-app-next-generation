import React from "react";
import PageLayoutWrapper from "../components/PageLayoutWrapper";
import { PlasmicComponent } from "@plasmicapp/loader-react";

export default function ScripturesPage() {
  return (
    <PageLayoutWrapper>
      <PlasmicComponent component="Scriptures" />
    </PageLayoutWrapper>
  );
}
