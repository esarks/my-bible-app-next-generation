// src/App.tsx
import * as React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ScripturePage from "./pages/ScripturePage";
import HomePage from "./pages/HomePage";
import ApiBiblePage from "./pages/ApiBiblePage";
import { logger } from "./lib/logger";

function App() {
  const location = useLocation();

  React.useEffect(() => {
    logger.info(`Route changed to ${location.pathname}`);
  }, [location.pathname]);

  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="scriptures" element={<ScripturePage />} />
      <Route path="passage" element={<ApiBiblePage />} />
    </Routes>
  );
}

export default App;
