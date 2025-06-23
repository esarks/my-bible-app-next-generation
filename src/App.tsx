import { Routes, Route } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ScripturePage from "./pages/ScripturePage";

function App() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route index element={<div>Home</div>} />
        <Route path="login" element={<LoginPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="scriptures" element={<ScripturePage />} />
      </Route>
    </Routes>
  );
}

export default App;
