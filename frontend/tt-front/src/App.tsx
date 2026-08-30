import "./App.css";
import { useEffect, useState } from "react";
import { NavLink, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";

import { isAuthenticated, logout } from "./services/api";
import Login from "./pages/login/login";
import Projects from "./pages/projects/projects";
import Register from "./pages/register/register";
import Tasks from "./pages/tasks/tasks";

function ProtectedRoute() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated);

  useEffect(() => {
    const handleExpiredSession = () => setAuthenticated(false);
    window.addEventListener("auth:expired", handleExpiredSession);
    return () => window.removeEventListener("auth:expired", handleExpiredSession);
  }, []);

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function HomeRedirect() {
  return <Navigate to={isAuthenticated() ? "/projects" : "/login"} replace />;
}

function AppLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/projects">
          <span className="brand-mark">✓</span>
          <span>Taskflow</span>
        </NavLink>
        <nav className="topbar-nav" aria-label="Основная навигация">
          <NavLink to="/projects">Проекты</NavLink>
        </nav>
        <button className="button button-ghost" onClick={handleLogout}>Выйти</button>
      </header>
      <main className="page-container"><Outlet /></main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId/tasks" element={<Tasks />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
