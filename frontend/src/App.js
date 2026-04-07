import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ProblemsPage from './pages/ProblemsPage';
import ProblemWorkspace from './pages/ProblemWorkspace';
import UserDashboard from './pages/UserDashboard';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
            <Routes>
              {/* Full-screen routes (no Navbar) */}
              <Route
                path="/problems/:id"
                element={
                  <ProtectedRoute>
                    <ProblemWorkspace />
                  </ProtectedRoute>
                }
              />

              {/* Routes with Navbar */}
              <Route
                path="*"
                element={
                  <>
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<AuthPage mode="login" />} />
                      <Route path="/register" element={<AuthPage mode="register" />} />
                      <Route path="/problems" element={<ProblemsPage />} />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <UserDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

