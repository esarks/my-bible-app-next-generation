import React from "react";
import PageLayoutWrapper from "../components/PageLayoutWrapper";
import { PlasmicComponent } from "@plasmicapp/loader-react";

export default function ProfilePage() {
  return (
    <PageLayoutWrapper>
      <PlasmicComponent component="Profile" />
    </PageLayoutWrapper>
  );
}
