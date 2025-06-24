import * as React from "react";
import { PlasmicPageLayout } from "../plasmic/app_starter/PlasmicPageLayout";
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
            <Link to="/scripture">Scripture</Link>
          </nav>
        ),
      }}
    >
      {children}
    </PlasmicPageLayout>
  );
}
