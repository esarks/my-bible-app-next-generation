import React from "react";
import PageLayoutWrapper from "../components/PageLayoutWrapper";
import { PlasmicComponent } from "@plasmicapp/loader-react";
import { logger } from "../lib/logger";

export default function ScripturesPage() {
  React.useEffect(() => {
    logger.info("Rendering ScripturePage");
  }, []);
  return (
    <PageLayoutWrapper>
      <PlasmicComponent component="Scriptures" />
    </PageLayoutWrapper>
  );
}
