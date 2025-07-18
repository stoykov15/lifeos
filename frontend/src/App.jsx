import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import { Routes, Route, Link } from "react-router-dom";
import Tasks from "./pages/Tasks";
import Finances from "./pages/Finances";
import Resources from "./pages/Resources";
import Planner from "./pages/Planner";
import UserSetup from "./pages/UserSetup";
import BudgetEditor from "./pages/BudgetEditor";
import ActivityLogger from "./pages/ActivityLogger";
import ProtectedRoute from "./lib/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import { fetchProfile } from "./lib/auth";
import Profile from "./pages/Profile";

export default function App() {
  const [user, setUser] = useState(null);
  const [justRegistered, setJustRegistered] = useState(false);

useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // 👈 skip fetchProfile if no token

    try {
      const profile = await fetchProfile();
      setUser(profile);
    } catch (e) {
      console.error("Auth check failed:", e);
      setUser(null);
    }
  };
  checkAuth();
}, []);


  const handleAuth = (profile, isNew = false) => {
    setUser(profile);
    setJustRegistered(isNew);
  };

  if (user && !user.setup_complete) {
  return <UserSetup onComplete={(updated) => setUser(updated)} />;
}

  if (!user) return <AuthPage onAuth={handleAuth} />;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">LifeOS</h1>
          <nav className="space-x-4 text-sm">
            <Link to="/">Dashboard</Link>
            <Link to="/tasks">Tasks</Link>
            <Link to="/finances">Finances</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/planner">Planner</Link>
            <Link to="/profile">Profile</Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setUser(null);
              }}
              className="ml-4 text-red-300 hover:text-red-100"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 max-w-5xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/finances" element={<ProtectedRoute><Finances /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
          <Route path="/setup" element={<UserSetup />} />
          <Route path="/edit-budget" element={<ProtectedRoute><BudgetEditor /></ProtectedRoute>} />
          <Route path="/log-expense" element={<ProtectedRoute><ActivityLogger /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-2 text-xs text-gray-500">
        Built with 💻 by You • {new Date().getFullYear()}
      </footer>
    </div>
  );
}
