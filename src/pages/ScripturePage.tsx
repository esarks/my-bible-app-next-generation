import React from "react";
import Scriptures from "../components/Scriptures";
// The Scriptures component already includes the page layout with a navbar.
// Wrapping it in another layout results in a duplicate navbar, so we
// render the component directly.
import { logger } from "../lib/logger";

export default function ScripturePage() {
  React.useEffect(() => {
    logger.info("Rendering ScripturePage");
  }, []);
  return <Scriptures />;
}
