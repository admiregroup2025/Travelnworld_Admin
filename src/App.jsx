import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./components/AdminDashboard";
import UserList from "./components/UserList";
import AgentList from "./components/AgentList";
import AddAgentForm from "./components/AddAgentForm";
import ExportData from "./components/ExportData";
import Login from "./components/Login";
import ProfileButton from "./components/ProfileButton";
import Additineraries from "./components/AddItineraries";
import AddUserForm from "./components/AddUserForm";
import Enquiry from "./components/Enquiry";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle sidebar visibility on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const PrivateRoute = () => {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route path="/profilebutton" element={<ProfileButton />} />

        <Route element={<PrivateRoute />}>
          <Route
            path="*"
            element={
              <div className="relative">
                {/* Mobile Menu Toggle Button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden fixed top-4 left-4 z-[1100] bg-blue-600 text-white border-none p-4 rounded-full cursor-pointer shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition-colors"
                  aria-label="Toggle sidebar"
                >
                  <i
                    className={`fas ${sidebarOpen ? "fa-times" : "fa-bars"}`}
                  ></i>
                </button>

                {/* Sidebar Component */}
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />

                {/* Overlay for mobile when sidebar is open */}
                {sidebarOpen && (
                  <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-40 z-[900] lg:hidden"
                  />
                )}

                {/* Main Content Area */}
                <div className="lg:ml-[280px] pt-6 px-4 sm:px-6 md:px-10 bg-[#f8fafc] min-h-screen">
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/allusers" element={<UserList />} />
                    <Route path="/adduser" element={<AddUserForm />} />
                    <Route path="/allagents" element={<AgentList />} />
                    <Route path="/addagent" element={<AddAgentForm />} />
                    <Route path="/exportdata" element={<ExportData />} />
                    <Route path="*" element={<Navigate to="/" />} />
                    <Route
                      path="/additineraries"
                      element={<Additineraries />}
                    />
                    <Route path="/enquries" element={<Enquiry />} />
                  </Routes>
                </div>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
