import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const [dropdownState, setDropdownState] = useState({
    admin: false,
    itineraries: false,
    bannerAds: false,
    agent: false,
  });

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-rotate {
          animation: rotate 3s linear infinite;
        }

        .nav-link-before {
          position: relative;
          overflow: hidden;
        }

        .nav-link-before::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgb(37, 99, 235), rgb(220, 38, 38));
          opacity: 0.1;
          transition: left 0.3s ease;
        }

        .nav-link-before:hover::before {
          left: 0;
        }

        .sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-scroll::-webkit-scrollbar-track {
          background: rgba(37, 99, 235, 0.05);
          border-radius: 10px;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(37, 99, 235, 0.3);
          border-radius: 10px;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(37, 99, 235, 0.5);
        }

        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(37, 99, 235, 0.3) rgba(37, 99, 235, 0.05);
        }
      `}</style>

      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        rel="stylesheet"
      />

      <aside
        className={`
          sidebar-scroll
          fixed top-0 left-0 w-[280px] h-screen
          bg-white/95 backdrop-blur-[15px] 
          border-r border-blue-600/20 
          z-[1000] 
          transition-transform duration-300 ease-in-out
          shadow-[2px_0_20px_rgba(0,0,0,0.1)]
          overflow-y-auto overflow-x-hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
        id="sidebar"
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-[15px] p-6 sm:p-8 border-b border-blue-600/20 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 flex items-center justify-center gap-2 mb-2">
            <i className="fas fa-shield-alt animate-rotate"></i>
            <span>TravelnWorld</span>
          </div>
          <div className="text-sm sm:text-base text-gray-500 font-medium">
            Super Admin Dashboard
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="py-4 pb-8">
          {/* Dashboard */}
          <div className="mx-4 my-2">
            <Link
              to="/"
              className={`
                nav-link-before
                flex items-center gap-4 px-6 py-4
                text-gray-800 no-underline rounded-xl
                transition-all duration-300
                ${
                  isActive("/")
                    ? "bg-gradient-to-r from-blue-600/10 to-red-600/10 text-blue-600 shadow-[0_4px_15px_rgba(37,99,235,0.2)]"
                    : "hover:bg-blue-600/10 hover:text-blue-600 hover:translate-x-1"
                }
              `}
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fas fa-tachometer-alt text-lg sm:text-xl w-5 text-center"></i>
              <span className="text-sm sm:text-base">Dashboard</span>
            </Link>
          </div>

          {/* User Dropdown */}
          <div className="mx-4 my-2">
            <div
              className="nav-link-before flex items-center justify-between px-6 py-4 text-gray-800 rounded-xl transition-all duration-300 cursor-pointer hover:bg-blue-600/10 hover:text-blue-600 hover:translate-x-1"
              onClick={() =>
                setDropdownState((prev) => ({
                  ...prev,
                  admin: !prev.admin,
                }))
              }
            >
              <div className="flex items-center gap-4">
                <i className="fas fa-user-cog text-lg sm:text-xl w-5 text-center"></i>
                <span className="text-sm sm:text-base">Admin</span>
              </div>
              <i
                className={`fas fa-chevron-right text-xs sm:text-sm transition-transform duration-300 ${
                  dropdownState.admin ? "rotate-90" : ""
                }`}
              ></i>
            </div>
            <div
              className={`pl-6 overflow-hidden transition-all duration-300 ${
                dropdownState.admin ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <Link
                to="/allusers"
                className={`block px-6 py-3 my-1 text-sm sm:text-base rounded-lg transition-all duration-200 no-underline ${
                  isActive("/allusers")
                    ? "text-blue-600 bg-blue-600/10 font-medium"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-600/10"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                All admin
              </Link>
              <Link
                to="/adduser"
                className={`block px-6 py-3 my-1 text-sm sm:text-base rounded-lg transition-all duration-200 no-underline ${
                  isActive("/adduser")
                    ? "text-blue-600 bg-blue-600/10 font-medium"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-600/10"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                Add admin
              </Link>
            </div>
          </div>

          {/* Agent Dropdown */}
          <div className="mx-4 my-2">
            <div
              className="nav-link-before flex items-center justify-between px-6 py-4 text-gray-800 rounded-xl transition-all duration-300 cursor-pointer hover:bg-blue-600/10 hover:text-blue-600 hover:translate-x-1"
              onClick={() =>
                setDropdownState((prev) => ({
                  ...prev,
                  agent: !prev.agent,
                }))
              }
            >
              <div className="flex items-center gap-4">
                <i className="fas fa-users text-lg sm:text-xl w-5 text-center"></i>
                <span className="text-sm sm:text-base">Agent</span>
              </div>
              <i
                className={`fas fa-chevron-right text-xs sm:text-sm transition-transform duration-300 ${
                  dropdownState.agent ? "rotate-90" : ""
                }`}
              ></i>
            </div>
            <div
              className={`pl-6 overflow-hidden transition-all duration-300 ${
                dropdownState.agent ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <Link
                to="/allagents"
                className={`block px-6 py-3 my-1 text-sm sm:text-base rounded-lg transition-all duration-200 no-underline ${
                  isActive("/allagents")
                    ? "text-blue-600 bg-blue-600/10 font-medium"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-600/10"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                All Agents
              </Link>
              <Link
                to="/addagent"
                className={`block px-6 py-3 my-1 text-sm sm:text-base rounded-lg transition-all duration-200 no-underline ${
                  isActive("/addagent")
                    ? "text-blue-600 bg-blue-600/10 font-medium"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-600/10"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                Add Agent
              </Link>
            </div>
          </div>

          {/* Itineraries Dropdown */}
          <div className="mx-4 my-2">
            <div
              className="nav-link-before flex items-center justify-between px-6 py-4 text-gray-800 rounded-xl transition-all duration-300 cursor-pointer hover:bg-blue-600/10 hover:text-blue-600 hover:translate-x-1"
              onClick={() =>
                setDropdownState((prev) => ({
                  ...prev,
                  itineraries: !prev.itineraries,
                }))
              }
            >
              <div className="flex items-center gap-4">
                <i className="fas fa-map-marked-alt text-lg sm:text-xl w-5 text-center"></i>
                <span className="text-sm sm:text-base">Itineraries</span>
              </div>
              <i
                className={`fas fa-chevron-right text-xs sm:text-sm transition-transform duration-300 ${
                  dropdownState.itineraries ? "rotate-90" : ""
                }`}
              ></i>
            </div>
            <div
              className={`pl-6 overflow-hidden transition-all duration-300 ${
                dropdownState.itineraries ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <Link
                to="/itinerary"
                className={`block px-6 py-3 my-1 text-sm sm:text-base rounded-lg transition-all duration-200 no-underline ${
                  isActive("/itineraries")
                    ? "text-blue-600 bg-blue-600/10 font-medium"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-600/10"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                All Itineraries
              </Link>
              {/* <Link
                to="/additineraries"
                className={`block px-6 py-3 my-1 text-sm sm:text-base rounded-lg transition-all duration-200 no-underline ${
                  isActive("/itineraries/add")
                    ? "text-blue-600 bg-blue-600/10 font-medium"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-600/10"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                Add Itinerary
              </Link> */}
              <Link
                to="/itineraries/form"
                className={`block px-6 py-3 my-1 text-sm sm:text-base rounded-lg transition-all duration-200 no-underline ${
                  isActive("/itineraries/form")
                    ? "text-blue-600 bg-blue-600/10 font-medium"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-600/10"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                Itinerary Form
              </Link>
            </div>
          </div>

          {/* Manage Home */}
          <div className="mx-4 my-2">
            <a
              href="manage-home.html"
              className="nav-link-before flex items-center gap-4 px-6 py-4 text-gray-800 no-underline rounded-xl transition-all duration-300 hover:bg-blue-600/10 hover:text-blue-600 hover:translate-x-1"
            >
              <i className="fas fa-home text-lg sm:text-xl w-5 text-center"></i>
              <span className="text-sm sm:text-base">Manage Home</span>
            </a>
          </div>

          {/* Team Management */}
          <div className="mx-4 my-2">
            <a
              href="manage-team.html"
              className="nav-link-before flex items-center gap-4 px-6 py-4 text-gray-800 no-underline rounded-xl transition-all duration-300 hover:bg-blue-600/10 hover:text-blue-600 hover:translate-x-1"
            >
              <i className="fas fa-user-friends text-lg sm:text-xl w-5 text-center"></i>
              <span className="text-sm sm:text-base">Team Management</span>
            </a>
          </div>
          {/* Banners */}
          <div className="mx-4 my-2">
            <div
              className="nav-link-before flex items-center justify-between px-6 py-4 text-gray-800 rounded-xl transition-all duration-300 cursor-pointer hover:bg-blue-600/10 hover:text-blue-600 hover:translate-x-1"
              onClick={() =>
                setDropdownState((prev) => ({
                  ...prev,
                  bannerAds: !prev.bannerAds,
                }))
              }
            >
              <div className="flex items-center gap-4">
                <i className="fas fa-ad text-lg sm:text-xl w-5 text-center"></i>
                <span className="text-sm sm:text-base">Banner Ads</span>
              </div>
              <i
                className={`fas fa-chevron-right text-xs sm:text-sm transition-transform duration-300 ${
                  dropdownState.bannerAds ? "rotate-90" : ""
                }`}
              ></i>
            </div>

              <div
                className={`pl-6 overflow-hidden transition-all duration-300 ${
                  dropdownState.bannerAds ? "max-h-[500px]" : "max-h-0"
                }`}
              >
                <Link
                  to="/topbanner"
                  className={`block px-6 py-3 my-1 text-sm sm:text-base rounded-lg transition-all duration-200 no-underline ${
                    isActive("/bannerads/home-top")
                      ? "text-blue-600 bg-blue-600/10 font-medium"
                      : "text-gray-500 hover:text-blue-600 hover:bg-blue-600/10"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  Home Top Banner
                </Link>

                <Link
                  to="/bannerads/manage"
                  className={`block px-6 py-3 my-1 text-sm sm:text-base rounded-lg transition-all duration-200 no-underline ${
                    isActive("/bannerads/manage")
                      ? "text-blue-600 bg-blue-600/10 font-medium"
                      : "text-gray-500 hover:text-blue-600 hover:bg-blue-600/10"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  Manage Banner Ads
                </Link>
              </div>
            </div>

          {/* Export PDF */}
          <div className="mx-4 my-2">
            <Link
              to="/exportdata"
              className={`
                nav-link-before
                flex items-center gap-4 px-6 py-4
                text-gray-800 no-underline rounded-xl
                transition-all duration-300
                ${
                  isActive("/exportdata")
                    ? "bg-gradient-to-r from-blue-600/10 to-red-600/10 text-blue-600 shadow-[0_4px_15px_rgba(37,99,235,0.2)]"
                    : "hover:bg-blue-600/10 hover:text-blue-600 hover:translate-x-1"
                }
              `}
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fas fa-file-pdf text-lg sm:text-xl w-5 text-center"></i>
              <span className="text-sm sm:text-base">Export PDF</span>
            </Link>
          </div>

          {/* Enquire - Added Here */}
          <div className="mx-4 my-2">
            <Link
              to="/enquries"
              className="nav-link-before flex items-center gap-4 px-6 py-4 text-gray-800 no-underline rounded-xl transition-all duration-300 hover:bg-blue-600/10 hover:text-blue-600 hover:translate-x-1"
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fas fa-question-circle text-lg sm:text-xl w-5 text-center"></i>
              <span className="text-sm sm:text-base">Enquire</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="mx-4 my-2">
            <a
              href="login.html"
              className="nav-link-before flex items-center gap-4 px-6 py-4 text-gray-800 no-underline rounded-xl transition-all duration-300 hover:bg-blue-600/10 hover:text-blue-600 hover:translate-x-1"
            >
              <i className="fas fa-sign-out-alt text-lg sm:text-xl w-5 text-center"></i>
              <span className="text-sm sm:text-base">Logout</span>
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
