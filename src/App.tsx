// src/App.tsx
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ScripturePage from "./pages/ScripturePage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="scriptures" element={<ScripturePage />} />
    </Routes>
  );
}

export default App;
