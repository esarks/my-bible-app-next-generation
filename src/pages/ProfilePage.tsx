import React from "react";
import PageLayoutWrapper from "../components/PageLayoutWrapper";
import { PlasmicComponent } from "@plasmicapp/loader-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProfilePage() {
  const { isVerified } = useAuth();

  if (!isVerified) {
    return <Navigate to="/login" replace />;
  }

  return (
    <PageLayoutWrapper>
      <PlasmicComponent component="Profile" />
    </PageLayoutWrapper>
  );
}
