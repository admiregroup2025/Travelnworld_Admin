import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProfileButton from "./ProfileButton";

export default function AdminDashboard() {
  useEffect(() => {
    createParticles();
  }, []);

  const createParticles = () => {
    const bg = document.getElementById("animatedBg");
    if (!bg) return;

    bg.innerHTML = "";
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className =
        "absolute rounded-full opacity-[0.03] animate-float bg-blue-600";

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
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.03; }
          50% { transform: translateY(-100px) rotate(180deg); opacity: 0.08; }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .stat-card-before {
          position: relative;
          overflow: hidden;
        }

        .stat-card-before::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(45deg, rgb(37, 99, 235), rgb(220, 38, 38));
        }

        @media (max-width: 768px) {
          .mobile-card {
            display: block !important;
          }
          .desktop-table {
            display: none !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-card {
            display: none !important;
          }
          .desktop-table {
            display: table !important;
          }
        }
      `}</style>

      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        rel="stylesheet"
      />

      <div
        className="fixed top-0 left-0 w-full h-full -z-[1] overflow-hidden bg-slate-50"
        id="animatedBg"
      ></div>

      <div className="relative min-h-screen">
        <main className="w-full p-4 sm:p-6 lg:p-8 min-h-screen">
          {/* Header - Responsive */}
     <header className="bg-white/90 backdrop-blur-[15px] p-4 sm:p-6 rounded-[20px] border border-blue-600/20 mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] relative z-10">
  <div className="text-xl sm:text-2xl lg:text-[2rem] font-bold text-blue-600 flex items-center gap-3 sm:gap-4">
  <i className="fas fa-map-marked-alt text-lg sm:text-xl w-5 text-center"></i>    <span>Dashboard</span>
  </div>
  <div className="flex items-center gap-3 sm:gap-4">
    <ProfileButton />
  </div>
</header>

          {/* Stats Grid - Responsive */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Link
              to={"/allusers"}
              className="stat-card-before bg-white/90 backdrop-blur-[15px] border border-blue-600/20 rounded-[20px] p-6 sm:p-8 text-center transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(37,99,235,0.15)]"
            >
              <div className="text-4xl sm:text-5xl text-blue-600 mb-3 sm:mb-4">
                <i className="fas fa-users"></i>
              </div>
              <span className="text-[2rem] sm:text-[2.5rem] font-extrabold text-blue-600 block mb-2">
                15
              </span>
              <div className="text-sm sm:text-base text-gray-500 font-medium">
                Total Employees
              </div>
            </Link>
            <Link
              to={"/allagents"}
              className="stat-card-before bg-white/90 backdrop-blur-[15px] border border-blue-600/20 rounded-[20px] p-6 sm:p-8 text-center transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(37,99,235,0.15)]"
            >
              <div className="text-4xl sm:text-5xl text-blue-600 mb-3 sm:mb-4">
                <i className="fas fa-user-shield"></i>
              </div>
              <span className="text-[2rem] sm:text-[2.5rem] font-extrabold text-blue-600 block mb-2">
                4
              </span>
              <div className="text-sm sm:text-base text-gray-500 font-medium">
                Agents
              </div>
            </Link>
            <div className="stat-card-before bg-white/90 backdrop-blur-[15px] border border-blue-600/20 rounded-[20px] p-6 sm:p-8 text-center transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(37,99,235,0.15)]">
              <div className="text-4xl sm:text-5xl text-blue-600 mb-3 sm:mb-4">
                <i className="fas fa-user-cog"></i>
              </div>
              <span className="text-[2rem] sm:text-[2.5rem] font-extrabold text-blue-600 block mb-2">
                3
              </span>
              <div className="text-sm sm:text-base text-gray-500 font-medium">
                Admin Users
              </div>
            </div>
            <div className="stat-card-before bg-white/90 backdrop-blur-[15px] border border-blue-600/20 rounded-[20px] p-6 sm:p-8 text-center transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(37,99,235,0.15)]">
              <div className="text-4xl sm:text-5xl text-blue-600 mb-3 sm:mb-4">
                <i className="fas fa-chart-line"></i>
              </div>
              <span className="text-[2rem] sm:text-[2.5rem] font-extrabold text-blue-600 block mb-2">
                99%
              </span>
              <div className="text-sm sm:text-base text-gray-500 font-medium">
                Successful Clients
              </div>
            </div>
          </div>

          {/* Recent Activities - Responsive Table/Cards */}
          <div className="bg-white/90 backdrop-blur-[15px] border border-blue-600/20 rounded-[20px] p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(37,99,235,0.15)]">
            <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-blue-600/20">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-blue-600">
                Recent Activities
              </h3>
            </div>

            {/* Desktop Table View */}
            <div className="desktop-table bg-white/90 rounded-[15px] overflow-x-auto border border-blue-600/20 shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10 bg-gradient-to-r from-blue-600/10 to-red-600/10 text-blue-600 font-semibold text-sm sm:text-base">
                      Activity
                    </th>
                    <th className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10 bg-gradient-to-r from-blue-600/10 to-red-600/10 text-blue-600 font-semibold text-sm sm:text-base">
                      User
                    </th>
                    <th className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10 bg-gradient-to-r from-blue-600/10 to-red-600/10 text-blue-600 font-semibold text-sm sm:text-base">
                      Time
                    </th>
                    <th className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10 bg-gradient-to-r from-blue-600/10 to-red-600/10 text-blue-600 font-semibold text-sm sm:text-base">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-blue-600/5">
                    <td className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10 text-sm sm:text-base">
                      New employee added
                    </td>
                    <td className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10 text-sm sm:text-base">
                      Admin User
                    </td>
                    <td className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10 text-sm sm:text-base">
                      2 hours ago
                    </td>
                    <td className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10">
                      <span className="text-emerald-600 font-semibold text-sm sm:text-base">
                        ✓ Success
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-600/5">
                    <td className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10 text-sm sm:text-base">
                      Team member updated
                    </td>
                    <td className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10 text-sm sm:text-base">
                      Admin User
                    </td>
                    <td className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10 text-sm sm:text-base">
                      5 hours ago
                    </td>
                    <td className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10">
                      <span className="text-emerald-600 font-semibold text-sm sm:text-base">
                        ✓ Success
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-600/5">
                    <td className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10 text-sm sm:text-base">
                      PDF report generated
                    </td>
                    <td className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10 text-sm sm:text-base">
                      Admin User
                    </td>
                    <td className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10 text-sm sm:text-base">
                      1 day ago
                    </td>
                    <td className="p-3 sm:p-4 lg:px-6 text-left border-b border-blue-600/10">
                      <span className="text-emerald-600 font-semibold text-sm sm:text-base">
                        ✓ Success
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-card space-y-4">
              <div className="bg-white rounded-[15px] border border-blue-600/20 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-blue-600">
                    New employee added
                  </div>
                  <span className="text-emerald-600 font-semibold text-sm">
                    ✓ Success
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <span className="font-medium">User:</span> Admin User
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> 2 hours ago
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-[15px] border border-blue-600/20 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-blue-600">
                    Team member updated
                  </div>
                  <span className="text-emerald-600 font-semibold text-sm">
                    ✓ Success
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <span className="font-medium">User:</span> Admin User
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> 5 hours ago
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-[15px] border border-blue-600/20 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-blue-600">
                    PDF report generated
                  </div>
                  <span className="text-emerald-600 font-semibold text-sm">
                    ✓ Success
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <span className="font-medium">User:</span> Admin User
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> 1 day ago
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - Responsive Grid */}
          <div className="bg-white/90 backdrop-blur-[15px] border border-blue-600/20 rounded-[20px] p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(37,99,235,0.15)]">
            <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-blue-600/20">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-blue-600">
                Quick Actions
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <a
                href="manage-employees.html"
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-br from-blue-600/10 to-red-600/10 rounded-[15px] no-underline text-blue-600 transition-all duration-300 hover:scale-105"
              >
                <i className="fas fa-user-plus text-xl sm:text-[2rem]"></i>
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base">
                    Add Employee
                  </div>
                  <div className="text-xs sm:text-sm opacity-80">
                    Quick employee registration
                  </div>
                </div>
              </a>
              <a
                href="manage-team.html"
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-br from-emerald-600/10 to-blue-600/10 rounded-[15px] no-underline text-emerald-600 transition-all duration-300 hover:scale-105"
              >
                <i className="fas fa-users-cog text-xl sm:text-[2rem]"></i>
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base">
                    Manage Team
                  </div>
                  <div className="text-xs sm:text-sm opacity-80">
                    Update team members
                  </div>
                </div>
              </a>
              <a
                href="export-data.html"
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-br from-red-600/10 to-emerald-600/10 rounded-[15px] no-underline text-red-600 transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1"
              >
                <i className="fas fa-download text-xl sm:text-[2rem]"></i>
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base">
                    Export Data
                  </div>
                  <div className="text-xs sm:text-sm opacity-80">
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
