// src/components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/profile">Profile</Link> |{" "}
      <Link to="/scriptures">Scriptures</Link>
    </nav>
  );
}
