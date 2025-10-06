import React, { useState } from "react";
import { HiUsers } from "react-icons/hi2";
import { HiPencil, HiTrash, HiEye } from "react-icons/hi";
import ProfileButton from "./ProfileButton";

const AgentList = () => {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const agents = [
    {
      name: "Evelyn Parker",
      email: "evelyn.parker@example.com",
      phone: "+1 (555) 222-3333",
    },
    {
      name: "Frank Miller",
      email: "frank.miller@example.com",
      phone: "+1 (555) 444-5555",
    },
    {
      name: "Grace Lee",
      email: "grace.lee@example.com",
      phone: "+1 (555) 666-7777",
    },
    {
      name: "Henry Scott",
      email: "henry.scott@example.com",
      phone: "+1 (555) 888-9999",
    },
  ];

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (value) => {
    setSearch(value);
    setShowSuggestions(false);
  };

  const filteredAgents = agents.filter((agent) =>
    `${agent.name} ${agent.email} ${agent.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full px-4 sm:px-8 py-6 bg-[#f8fafc]">
      {/* Header */}
     <header className="relative z-10 bg-white/90 backdrop-blur-xl border border-[rgba(37,99,235,0.2)] rounded-2xl shadow-md mb-6 px-6 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
  <div className="flex items-center text-blue-600 text-2xl font-bold gap-4">
    <HiUsers className="text-[#2563eb] text-3xl" />
    <span className="text-3xl font-bold">Agents</span>
  </div>
  <div className="flex items-center gap-4 w-full sm:w-auto">
    <ProfileButton />
  </div>
</header>

      {/* Search Input */}
      <div className="relative flex justify-end mb-6">
        <div className="w-full sm:w-1/3 relative">
          <input
            type="text"
            placeholder="Search agents..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={handleSearch}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            onFocus={() => search && setShowSuggestions(true)}
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && search.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-200 shadow-md rounded-md w-full mt-1 max-h-40 overflow-y-auto">
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(agent.name)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                  >
                    {agent.name}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500 text-sm">
                  No agents found
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Responsive Table/Card */}
      <div className="overflow-x-auto">
        {/* Table for md and above */}
        <table className="min-w-[600px] w-full bg-white rounded-2xl shadow-md hidden md:table">
          <thead>
            <tr className="bg-[linear-gradient(45deg,rgba(37,99,235,0.1),rgba(220,38,38,0.1))] text-[#2563eb]">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Phone</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.map((agent, index) => (
              <tr key={index} className="hover:bg-gray-100 transition">
                <td className="py-3 px-4">{agent.name}</td>
                <td className="py-3 px-4">{agent.email}</td>
                <td className="py-3 px-4">{agent.phone}</td>
                <td className="py-3 px-4 flex gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 p-2 rounded"
                    aria-label={`View ${agent.name}`}
                    onClick={() => alert(`View agent: ${agent.name}`)}
                  >
                    <HiEye size={20} className="cursor-pointer" />
                  </button>
                  <button
                    className="text-green-600 hover:text-green-800 p-2 rounded"
                    aria-label={`Edit ${agent.name}`}
                    onClick={() => alert(`Edit agent: ${agent.name}`)}
                  >
                    <HiPencil size={20} className="cursor-pointer" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 p-2 rounded"
                    aria-label={`Delete ${agent.name}`}
                    onClick={() => alert(`Delete agent: ${agent.name}`)}
                  >
                    <HiTrash size={20} className="cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredAgents.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Card view for small screens */}
        <div className="flex flex-col space-y-4 md:hidden">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-4 flex flex-col space-y-2"
              >
                <div className="text-lg font-semibold text-[#2563eb]">
                  {agent.name}
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Email:</strong> {agent.email}
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Phone:</strong> {agent.phone}
                </div>
                <div className="flex gap-4 mt-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 p-2 rounded"
                    aria-label={`View ${agent.name}`}
                    onClick={() => alert(`View agent: ${agent.name}`)}
                  >
                    <HiEye size={20} className="cursor-pointer" />
                  </button>
                  <button
                    className="text-green-600 hover:text-green-800 p-2 rounded"
                    aria-label={`Edit ${agent.name}`}
                    onClick={() => alert(`Edit agent: ${agent.name}`)}
                  >
                    <HiPencil size={20} className="cursor-pointer" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 p-2 rounded"
                    aria-label={`Delete ${agent.name}`}
                    onClick={() => alert(`Delete agent: ${agent.name}`)}
                  >
                    <HiTrash size={20} className="cursor-pointer" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No agents found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentList;
