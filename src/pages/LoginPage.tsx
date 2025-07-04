import * as React from "react";
import Login from "../components/Login";
import { logger } from "../lib/logger";

function LoginPage() {
  React.useEffect(() => {
    logger.info("Rendering LoginPage");
  }, []);
  return <Login />;
}

export default LoginPage;
