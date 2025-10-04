import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    createParticles();

    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (window.innerWidth <= 1024) {
        const sidebar = document.getElementById("sidebar");
        const toggle = document.getElementById("mobileMenuToggle");
        if (
          sidebar &&
          toggle &&
          !sidebar.contains(e.target) &&
          !toggle.contains(e.target)
        ) {
          setSidebarOpen(false);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const createParticles = () => {
    const bg = document.getElementById("animatedBg");
    if (!bg) return;

    bg.innerHTML = "";
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "bg-particle";

      const size = Math.random() * 4 + 2;
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 8 + "s";
      particle.style.animationDuration = Math.random() * 10 + 5 + "s";

      bg.appendChild(particle);
    }
  };

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

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f8fafc;
          color: var(--text-primary);
          overflow-x: hidden;
          line-height: 1.6;
        }

        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
        }

        .bg-particle {
          position: absolute;
          background: var(--primary-color);
          border-radius: 50%;
          opacity: 0.03;
          animation: float 8s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.03; }
          50% { transform: translateY(-100px) rotate(180deg); opacity: 0.08; }
        }

        .dashboard {
          display: flex;
          min-height: 100vh;
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

        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: 2rem;
          min-height: 100vh;
        }

        .content-header {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(15px);
          padding: 1.5rem 2rem;
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-color);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(15px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
        }

        .stat-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 15px 35px rgba(37, 99, 235, 0.15);
        }

        .stat-icon {
          font-size: 3rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--primary-color);
          display: block;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(15px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(37, 99, 235, 0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--primary-color);
        }

        .table-container {
          background: rgba(255,255,255,0.9);
          border-radius: 15px;
          overflow: hidden;
          border: 1px solid var(--glass-border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th,
        .data-table td {
          padding: 1rem 1.5rem;
          text-align: left;
          border-bottom: 1px solid rgba(37, 99, 235, 0.1);
        }

        .data-table th {
          background: linear-gradient(45deg, rgba(37, 99, 235, 0.1), rgba(220, 38, 38, 0.1));
          color: var(--primary-color);
          font-weight: 600;
        }

        .data-table tr:hover {
          background: rgba(37, 99, 235, 0.05);
        }

        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .main-content {
            margin-left: 0;
          }

          .mobile-menu-toggle {
            display: block !important;
            position: fixed;
            top: 1rem;
            left: 1rem;
            z-index: 1100;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
          }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
          }

          .content-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        rel="stylesheet"
      />

      <div className="animated-bg" id="animatedBg"></div>

      <button
        className="mobile-menu-toggle"
        id="mobileMenuToggle"
        style={{ display: window.innerWidth <= 1024 ? "block" : "none" }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className="fas fa-bars"></i>
      </button>

      <div className="dashboard">
        <main className="main-content">
          <header className="content-header">
            <div className="page-title">
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </div>
            <div className="user-info">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>Admin User</div>
                <div
                  style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}
                >
                  Administrator
                </div>
              </div>
            </div>
          </header>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <span className="stat-number">15</span>
              <div className="stat-label">Total Employees</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-user-shield"></i>
              </div>
              <span className="stat-number">4</span>
              <div className="stat-label">Agents</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-user-cog"></i>
              </div>
              <span className="stat-number">3</span>
              <div className="stat-label">Admin Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <span className="stat-number">99%</span>
              <div className="stat-label">Successful Clients</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Activities</h3>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>User</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>New employee added</td>
                    <td>Admin User</td>
                    <td>2 hours ago</td>
                    <td>
                      <span
                        style={{
                          color: "var(--accent-color)",
                          fontWeight: 600,
                        }}
                      >
                        ✓ Success
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Team member updated</td>
                    <td>Admin User</td>
                    <td>5 hours ago</td>
                    <td>
                      <span
                        style={{
                          color: "var(--accent-color)",
                          fontWeight: 600,
                        }}
                      >
                        ✓ Success
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>PDF report generated</td>
                    <td>Admin User</td>
                    <td>1 day ago</td>
                    <td>
                      <span
                        style={{
                          color: "var(--accent-color)",
                          fontWeight: 600,
                        }}
                      >
                        ✓ Success
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <a
                href="manage-employees.html"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1.5rem",
                  background:
                    "linear-gradient(45deg, rgba(37, 99, 235, 0.1), rgba(220, 38, 38, 0.1))",
                  borderRadius: "15px",
                  textDecoration: "none",
                  color: "var(--primary-color)",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <i
                  className="fas fa-user-plus"
                  style={{ fontSize: "2rem" }}
                ></i>
                <div>
                  <div style={{ fontWeight: 600 }}>Add Employee</div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    Quick employee registration
                  </div>
                </div>
              </a>
              <a
                href="manage-team.html"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1.5rem",
                  background:
                    "linear-gradient(45deg, rgba(5, 150, 105, 0.1), rgba(37, 99, 235, 0.1))",
                  borderRadius: "15px",
                  textDecoration: "none",
                  color: "var(--accent-color)",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <i
                  className="fas fa-users-cog"
                  style={{ fontSize: "2rem" }}
                ></i>
                <div>
                  <div style={{ fontWeight: 600 }}>Manage Team</div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    Update team members
                  </div>
                </div>
              </a>
              <a
                href="export-data.html"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1.5rem",
                  background:
                    "linear-gradient(45deg, rgba(220, 38, 38, 0.1), rgba(5, 150, 105, 0.1))",
                  borderRadius: "15px",
                  textDecoration: "none",
                  color: "var(--secondary-color)",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <i className="fas fa-download" style={{ fontSize: "2rem" }}></i>
                <div>
                  <div style={{ fontWeight: 600 }}>Export Data</div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    Generate PDF reports
                  </div>
                </div>
              </a>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
