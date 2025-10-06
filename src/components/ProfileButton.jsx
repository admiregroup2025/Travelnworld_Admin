import React, { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";

const ProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    // console.log("Toggling dropdown, current state:", isOpen);
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left z-[9999]" ref={dropdownRef}>
      {/* Avatar + Info */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={toggleDropdown}
      >
        <div className="rounded-full w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-md hover:shadow-lg transition-all duration-200">
          <FaUser className="text-white text-2xl" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 leading-tight">
            Admin User
          </h2>
          <p className="text-sm text-gray-600 font-medium">Administrator</p>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999]">
          <ul className="py-2 text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md transition-colors duration-200">
              Profile
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md transition-colors duration-200">
              Change Password
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
