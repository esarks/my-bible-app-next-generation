import React from "react";
import PageLayoutWrapper from "../components/PageLayoutWrapper";
import { PlasmicComponent } from "@plasmicapp/loader-react";
import { logger } from "../lib/logger";

export default function HomePage() {
  React.useEffect(() => {
    logger.info("Rendering HomePage");
  }, []);
  return (
    <PageLayoutWrapper>
      <PlasmicComponent component="Homepage" />
    </PageLayoutWrapper>
  );
}
