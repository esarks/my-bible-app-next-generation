// src/components/PageLayoutWrapper.tsx

import * as React from "react";
import { PlasmicPageLayout } from "../plasmic/my_bible_app_next_generation/PlasmicPageLayout";
import { Link } from "react-router-dom";

export default function PageLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PlasmicPageLayout
      navbar={{
        children: (
          <nav style={{ padding: "1rem", backgroundColor: "#eee" }}>
            <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
            <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
            <Link to="/profile" style={{ marginRight: "1rem" }}>Profile</Link>
            <Link to="/scriptures" style={{ marginRight: "1rem" }}>Scriptures</Link>
            <Link to="/passage">API.Bible Demo</Link>
          </nav>
        ),
      }}
      children={children}
    />
  );
}
