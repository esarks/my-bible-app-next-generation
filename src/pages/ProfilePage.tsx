import React from "react";
import Profile from "../components/Profile";
import { logger } from "../lib/logger";

export default function ProfilePage() {
  React.useEffect(() => {
    logger.info("Rendering ProfilePage");
  }, []);
  return (
    <Profile />
  );
}
