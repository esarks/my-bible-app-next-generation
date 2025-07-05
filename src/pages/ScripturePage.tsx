import React from "react";
import Scriptures from "../components/Scriptures";
import { logger } from "../lib/logger";

export default function ScripturePage() {
  React.useEffect(() => {
    logger.info("Rendering ScripturePage");
  }, []);
  return <Scriptures />;
}
