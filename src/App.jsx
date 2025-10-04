import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./components/AdminDashboard";
import UserList from "./components/UserList";
import AgentList from "./components/AgentList";
import AddAgentForm from "./components/AddAgentForm";
import ExportData from "./components/ExportData";
import Login from "./components/Login";
import ProfileButton from "./components/ProfileButton";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const PrivateRoute = () => {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
<Route path="/profilebutton" element={<ProfileButton />} />
        <Route element={<PrivateRoute />}>
          <Route
            path="*"
            element={
              <>
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {sidebarOpen && (
                  <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-40 z-[900] lg:hidden"
                  />
                )}

                <div className="lg:ml-[280px] pt-6 px-4 sm:px-6 md:px-10 bg-[#f8fafc] min-h-screen">
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/allusers" element={<UserList />} />
                    <Route path="/allagents" element={<AgentList />} />
                    <Route path="/addagent" element={<AddAgentForm />} />
                    <Route path="/exportdata" element={<ExportData />} />
                    
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              </>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
