import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Workouts from "./pages/Workouts";
import Hydration from "./pages/Hydration";
import Progress from "./pages/Progress";
import Goals from "./pages/Goals";
import "./App.css";

// Protected route
function ProtectedRoute({ element }) {
  const isAuthenticated = !!localStorage.getItem("userId");
  return isAuthenticated ? element : <Navigate to="/login" />;
}

export default function App() {
  const isAuthenticated = !!localStorage.getItem("userId");

  function logout() {
    localStorage.removeItem("userId");
    window.location.href = "/login";
  }

  return (
    <Router>
      <nav className="nav">
        <div className="nav-title">FitTrack</div>

        {isAuthenticated && (
          <>
            <NavLink to="/" end>Dashboard</NavLink>
            <NavLink to="/workouts">Workouts</NavLink>
            <NavLink to="/hydration">Hydration</NavLink>
            <NavLink to="/progress">Progress</NavLink>
            <NavLink to="/goals">Goals</NavLink>
          </>
        )}

        <div className="nav-right">
          {!isAuthenticated ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          ) : (
            <button onClick={logout}>Logout</button>
          )}
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/workouts" element={<ProtectedRoute element={<Workouts />} />} />
          <Route path="/hydration" element={<ProtectedRoute element={<Hydration />} />} />
          <Route path="/progress" element={<ProtectedRoute element={<Progress />} />} />
          <Route path="/goals" element={<ProtectedRoute element={<Goals />} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}
