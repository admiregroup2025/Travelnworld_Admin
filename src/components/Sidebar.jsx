// Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  // Updated to handle multiple dropdowns
  const [dropdownState, setDropdownState] = useState({
    user: false,
    settings: false,
    agent: false, // <- add this
  });

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        :root {
          --primary-color: #2563eb;
          --secondary-color: #dc2626;
          --accent-color: #059669;
          --dark-bg: #ffffff;
          --card-bg: rgba(255,255,255,0.9);
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --glass-border: rgba(37, 99, 235, 0.2);
          --sidebar-bg: rgba(255,255,255,0.95);
          --hover-bg: rgba(37, 99, 235, 0.1);
        }

        .sidebar {
          width: 280px;
          background: var(--sidebar-bg);
          backdrop-filter: blur(15px);
          border-right: 1px solid var(--glass-border);
          position: fixed;
          min-height: 100vh;
          overflow-y: auto;
          z-index: 1000;
          transition: all 0.3s ease;
          box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
        }

        .sidebar.open {
          transform: translateX(0);
        }

        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          border-bottom: 1px solid var(--glass-border);
          text-align: center;
        }

        .admin-logo {
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .admin-logo i {
          animation: rotate 3s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .admin-title {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .nav-menu {
          padding: 1rem 0;
        }

        .nav-item {
          margin: 0.5rem 1rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          color: var(--text-primary);
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
          opacity: 0.1;
          transition: left 0.3s ease;
        }

        .nav-link:hover::before {
          left: 0;
        }

        .nav-link:hover {
          background: var(--hover-bg);
          color: var(--primary-color);
          transform: translateX(5px);
        }

        .nav-link.active {
          background: linear-gradient(45deg, rgba(37, 99, 235, 0.1), rgba(220, 38, 38, 0.1));
          color: var(--primary-color);
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
        }

        .nav-icon {
          font-size: 1.2rem;
          width: 20px;
          text-align: center;
        }

        /* Dropdown Styles */
        .dropdown-toggle {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .dropdown-arrow {
          transition: transform 0.3s ease;
        }

        .dropdown-arrow.open {
          transform: rotate(90deg);
        }

        .dropdown-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          padding-left: 1.5rem;
        }

        .dropdown-menu.open {
          max-height: 500px;
        }

        .dropdown-link {
          display: block;
          padding: 0.75rem 1.5rem;
          text-decoration: none;
          color: var(--text-secondary);
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .dropdown-link:hover {
          color: var(--primary-color);
          background: var(--hover-bg);
        }

        .dropdown-link.active {
          color: var(--primary-color);
          background: rgba(37, 99, 235, 0.1);
          font-weight: 500;
        }
      `}</style>

      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        rel="stylesheet"
      />

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} id="sidebar">
        <div className="sidebar-header">
          <div className="admin-logo">
            <i className="fas fa-shield-alt"></i>
            Admire
          </div>
          <div className="admin-title">Admin Dashboard</div>
        </div>

        <nav className="nav-menu">
          {/* Dashboard */}
          <div className="nav-item">
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className="nav-icon fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </Link>
          </div>

          {/* User Dropdown */}
          <div className="nav-item">
            <div
              className="nav-link dropdown-toggle"
              onClick={() =>
                setDropdownState((prev) => ({
                  ...prev,
                  user: !prev.user,
                }))
              }
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <i className="nav-icon fas fa-user-cog"></i>
                <span>User</span>
              </div>
              <i
                className={`fas fa-chevron-right dropdown-arrow ${
                  dropdownState.user ? "open" : ""
                }`}
              ></i>
            </div>
            <div
              className={`dropdown-menu ${dropdownState.user ? "open" : ""}`}
            >
              <Link
                to="/allusers"
                className={`dropdown-link ${
                  isActive("/users/all") ? "active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                All Users
              </Link>
              <Link
                to="/users/add"
                className={`dropdown-link ${
                  isActive("/users/add") ? "active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                Add User
              </Link>
            </div>
          </div>

          {/* Settings Dropdown */}
          <div className="nav-item">
            <div
              className="nav-link dropdown-toggle"
              onClick={() =>
                setDropdownState((prev) => ({
                  ...prev,
                  settings: !prev.settings,
                }))
              }
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <i className="nav-icon fas fa-cogs"></i>
                <span>Settings</span>
              </div>
              <i
                className={`fas fa-chevron-right dropdown-arrow ${
                  dropdownState.settings ? "open" : ""
                }`}
              ></i>
            </div>
            <div
              className={`dropdown-menu ${
                dropdownState.settings ? "open" : ""
              }`}
            >
              <Link
                to="/settings/profile"
                className={`dropdown-link ${
                  isActive("/settings/profile") ? "active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                Profile Settings
              </Link>
              <Link
                to="/settings/security"
                className={`dropdown-link ${
                  isActive("/settings/security") ? "active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                Security
              </Link>
            </div>
          </div>

          {/* Other Static Links */}
          {/* Agent Dropdown Start */}
          <div className="nav-item">
            <div
              className="nav-link dropdown-toggle"
              onClick={() =>
                setDropdownState((prev) => ({
                  ...prev,
                  agent: !prev.agent,
                }))
              }
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <i className="nav-icon fas fa-users"></i>
                <span>Agent</span>
              </div>
              <i
                className={`fas fa-chevron-right dropdown-arrow ${
                  dropdownState.agent ? "open" : ""
                }`}
              ></i>
            </div>
            <div
              className={`dropdown-menu ${dropdownState.agent ? "open" : ""}`}
            >
              <Link
                to="/allagents"
                className={`dropdown-link ${
                  isActive("/agents/all") ? "active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                All Agents
              </Link>
              <Link
                to="/agents/add"
                className={`dropdown-link ${
                  isActive("/agents/add") ? "active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                Add Agent
              </Link>
            </div>
          </div>
          {/* Agent Dropdown End */}

          <div className="nav-item">
            <a href="manage-home.html" className="nav-link">
              <i className="nav-icon fas fa-home"></i>
              <span>Manage Home</span>
            </a>
          </div>

          <div className="nav-item">
            <a href="manage-team.html" className="nav-link">
              <i className="nav-icon fas fa-user-friends"></i>
              <span>Team Management</span>
            </a>
          </div>

          <div className="nav-item">
            <Link to="/exportdata" className="nav-link">
              <i className="nav-icon fas fa-file-pdf"></i>
              <span>Export PDF</span>
            </Link>
          </div>

          <div className="nav-item">
            <a href="login.html" className="nav-link">
              <i className="nav-icon fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
