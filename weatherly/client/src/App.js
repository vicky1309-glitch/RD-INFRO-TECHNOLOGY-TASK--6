import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import NotificationToasts from "./components/NotificationToasts";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Compare from "./pages/Compare";
import Planner from "./pages/Planner";

function OfflineBanner() {
  useEffect(() => {}, []);
  return null;
}

export default function App() {
  const theme = useSelector((state) => state.theme.current);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <BrowserRouter>
      <Navbar />
      <NotificationToasts />
      <OfflineBanner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/planner" element={<Planner />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
