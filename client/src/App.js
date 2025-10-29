import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Workouts from "./pages/Workouts";
import Hydration from "./pages/Hydration";
import Progress from "./pages/Progress";
import Goals from "./pages/Goals";
import "./App.css";

// Protected route component
function ProtectedRoute({ element }) {
  const isAuthenticated = !!localStorage.getItem("userId"); // Check if userId exists in localStorage
  return isAuthenticated ? element : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <nav className="nav">
        <Link to="/">Dashboard</Link>
        <Link to="/workouts">Workouts</Link>
        <Link to="/hydration">Hydration</Link>
        <Link to="/progress">Progress</Link>
        <Link to="/goals">Goals</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
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
