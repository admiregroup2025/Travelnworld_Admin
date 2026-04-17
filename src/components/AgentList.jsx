import React, { useState, useEffect } from "react";
import { HiUsers } from "react-icons/hi2";
import { HiPencil, HiTrash, HiEye } from "react-icons/hi";
import ProfileButton from "./ProfileButton";
import axios from "axios";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiBase = import.meta.env.VITE_API_BASE || "";

      const res = await axios.get(`${apiBase}/api/agents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAgents(res.data);
    } catch (err) {
      console.error("Error fetching agents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (value) => {
    setSearch(value);
    setShowSuggestions(false);
  };

  const handleView = (agent) => {
    setSelectedAgent(agent);
  };

  const handleCloseView = () => {
    setSelectedAgent(null);
  };

  const handleEditClick = (agent) => {
    setEditData({
      firstName: agent.firstName || "",
      lastName: agent.lastName || "",
      email: agent.email || "",
      phone: agent.phone || "",
    });
    setSelectedAgent(agent);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedAgent) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const apiBase = import.meta.env.VITE_API_BASE || "";
      await axios.put(`${apiBase}/api/agents/${selectedAgent._id}`, editData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchAgents();
      setShowEditModal(false);
      setSelectedAgent(null);
    } catch (err) {
      console.error("Error updating agent", err);
      alert(err.response?.data?.message || "Unable to update agent");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (agentId) => {
    if (!window.confirm("Delete this agent?")) return;

    try {
      const token = localStorage.getItem("token");
      const apiBase = import.meta.env.VITE_API_BASE || "";
      await axios.delete(`${apiBase}/api/agents/${agentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchAgents();
    } catch (err) {
      console.error("Error deleting agent", err);
      alert(err.response?.data?.message || "Unable to delete agent");
    }
  };

  const filteredAgents = agents.filter((agent) => {
    const agentName = `${agent.firstName || ""} ${agent.lastName || ""}`.trim();
    return `${agentName} ${agent.email || ""} ${agent.phone || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const getAgentName = (agent) => `${agent.firstName || ""} ${agent.lastName || ""}`.trim();

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
                filteredAgents.map((agent, index) => {
                  const agentName = getAgentName(agent);
                  return (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(agentName)}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    >
                      {agentName}
                    </li>
                  );
                })
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
            {filteredAgents.map((agent, index) => {
              const agentName = getAgentName(agent);
              return (
                <tr key={index} className="hover:bg-gray-100 transition">
                  <td className="py-3 px-4">{agentName}</td>
                  <td className="py-3 px-4">{agent.email}</td>
                  <td className="py-3 px-4">{agent.phone}</td>
                  <td className="py-3 px-4 flex gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800 p-2 rounded"
                      aria-label={`View ${agentName}`}
                      onClick={() => handleView(agent)}
                    >
                      <HiEye size={20} className="cursor-pointer" />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800 p-2 rounded"
                      aria-label={`Edit ${agentName}`}
                      onClick={() => handleEditClick(agent)}
                    >
                      <HiPencil size={20} className="cursor-pointer" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 p-2 rounded"
                      aria-label={`Delete ${agentName}`}
                      onClick={() => handleDelete(agent._id)}
                    >
                      <HiTrash size={20} className="cursor-pointer" />
                    </button>
                  </td>
                </tr>
              );
            })}
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
            filteredAgents.map((agent, index) => {
              const agentName = getAgentName(agent);
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-4 flex flex-col space-y-2"
                >
                  <div className="text-lg font-semibold text-[#2563eb]">
                    {agentName}
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
                    aria-label={`View ${agentName}`}
                    onClick={() => handleView(agent)}
                  >
                    <HiEye size={20} className="cursor-pointer" />
                  </button>
                  <button
                    className="text-green-600 hover:text-green-800 p-2 rounded"
                    aria-label={`Edit ${agentName}`}
                    onClick={() => handleEditClick(agent)}
                  >
                    <HiPencil size={20} className="cursor-pointer" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 p-2 rounded"
                    aria-label={`Delete ${agentName}`}
                    onClick={() => handleDelete(agent._id)}
                  >
                    <HiTrash size={20} className="cursor-pointer" />
                  </button>
                </div>
              </div>
            )})
          ) : (
            <div className="text-center py-4 text-gray-500">
              No agents found.
            </div>
          )}
        </div>
      </div>

      {selectedAgent && !showEditModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#1e3a8a]">Agent Details</h2>
                <p className="text-sm text-gray-500">Full record from the database</p>
              </div>
              <button
                className="text-gray-500 hover:text-gray-900"
                onClick={handleCloseView}
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{getAgentName(selectedAgent) || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{selectedAgent.email || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{selectedAgent.phone || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium text-gray-900">{selectedAgent.role || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Active</p>
                <p className="font-medium text-gray-900">{selectedAgent.isActive ? "Yes" : "No"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Verified</p>
                <p className="font-medium text-gray-900">{selectedAgent.isVerified ? "Yes" : "No"}</p>
              </div>
              {selectedAgent.company && (
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium text-gray-900">{selectedAgent.company}</p>
                </div>
              )}
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm text-gray-500">Registered Email</p>
                <p className="font-medium text-gray-900">{selectedAgent.registeredEmail || "N/A"}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm text-gray-500">Secondary Email</p>
                <p className="font-medium text-gray-900">{selectedAgent.secondaryEmail || "N/A"}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium text-gray-900">{selectedAgent.createdAt ? new Date(selectedAgent.createdAt).toLocaleString() : "N/A"}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                onClick={() => handleEditClick(selectedAgent)}
              >
                Edit
              </button>
              <button
                className="rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700"
                onClick={() => handleDelete(selectedAgent._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedAgent && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#1e3a8a]">Edit Agent</h2>
                <p className="text-sm text-gray-500">Update the fields below and save changes.</p>
              </div>
              <button
                className="text-gray-500 hover:text-gray-900"
                onClick={() => setShowEditModal(false)}
                aria-label="Close edit form"
              >
                ✕
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSaveEdit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    name="firstName"
                    value={editData.firstName}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    name="lastName"
                    value={editData.lastName}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    name="phone"
                    value={editData.phone}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentList;
