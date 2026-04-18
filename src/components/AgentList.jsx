import React, { useState, useEffect } from "react";
import { HiUsers } from "react-icons/hi2";
import { HiPencil, HiTrash, HiEye } from "react-icons/hi";
import ProfileButton from "./ProfileButton";
import axios from "axios";

// ── Helpers defined OUTSIDE the component so they are never re-created on re-render ──

const ViewRow = ({ label, value, fullWidth }) => (
  <div className={`space-y-1 ${fullWidth ? "sm:col-span-2" : ""}`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-900">{value || "N/A"}</p>
  </div>
);

const EditField = ({ label, name, value, type = "text", onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-200"
    />
  </div>
);

const SectionLabel = ({ title }) => (
  <p className="text-sm font-semibold text-blue-700 border-b border-gray-200 pb-1 mt-2">{title}</p>
);

const formatAddress = (addr) => {
  if (!addr) return "N/A";
  const filled = [addr.houseNo, addr.street, addr.area, addr.city, addr.state, addr.postalCode, addr.country]
    .filter(Boolean).join(", ");
  return filled || "N/A";
};

// ─────────────────────────────────────────────────────────────────────────────

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
    registeredEmail: "",
    secondaryEmail: "",
    photo: "",
    companyAddress: { houseNo: "", street: "", area: "", city: "", state: "", postalCode: "", country: "" },
    branchAddress:  { houseNo: "", street: "", area: "", city: "", state: "", postalCode: "", country: "" },
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiBase = import.meta.env.VITE_API_BASE || "";
      const res = await axios.get(`${apiBase}/api/agents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(res.data);
    } catch (err) {
      console.error("Error fetching agents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAgents(); }, []);

  const handleVerify = async (agentId, currentVerified) => {
    try {
      const token = localStorage.getItem("token");
      const apiBase = import.meta.env.VITE_API_BASE || "";
      await axios.put(
        `${apiBase}/api/agents/${agentId}`,
        { isVerified: !currentVerified },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchAgents();
    } catch (err) {
      console.error("Error updating verification", err);
      alert(err.response?.data?.message || "Unable to update verification");
    }
  };

  const handleSearch = (e) => { setSearch(e.target.value); setShowSuggestions(true); };
  const handleSuggestionClick = (value) => { setSearch(value); setShowSuggestions(false); };
  const handleView = (agent) => { setSelectedAgent(agent); };
  const handleCloseView = () => { setSelectedAgent(null); };

  const handleEditClick = (agent) => {
    setEditData({
      firstName: agent.firstName || "",
      lastName: agent.lastName || "",
      email: agent.email || "",
      phone: agent.phone || "",
      registeredEmail: agent.registeredEmail || "",
      secondaryEmail: agent.secondaryEmail || "",
      photo: agent.photo || "",
      companyAddress: {
        houseNo:    agent.companyAddress?.houseNo    || "",
        street:     agent.companyAddress?.street     || "",
        area:       agent.companyAddress?.area       || "",
        city:       agent.companyAddress?.city       || "",
        state:      agent.companyAddress?.state      || "",
        postalCode: agent.companyAddress?.postalCode || "",
        country:    agent.companyAddress?.country    || "",
      },
      branchAddress: {
        houseNo:    agent.branchAddress?.houseNo    || "",
        street:     agent.branchAddress?.street     || "",
        area:       agent.branchAddress?.area       || "",
        city:       agent.branchAddress?.city       || "",
        state:      agent.branchAddress?.state      || "",
        postalCode: agent.branchAddress?.postalCode || "",
        country:    agent.branchAddress?.country    || "",
      },
    });
    setSelectedAgent(agent);
    setShowEditModal(true);
  };

  // Flat fields
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Nested address fields
  const handleAddressChange = (addressKey) => (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [addressKey]: { ...prev[addressKey], [name]: value },
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedAgent) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const apiBase = import.meta.env.VITE_API_BASE || "";
      await axios.put(`${apiBase}/api/agents/${selectedAgent._id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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

  const getAgentName = (agent) =>
    `${agent.firstName || ""} ${agent.lastName || ""}`.trim();

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

      {/* Search */}
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
          {showSuggestions && search.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-200 shadow-md rounded-md w-full mt-1 max-h-40 overflow-y-auto">
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(getAgentName(agent))} className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm">
                    {getAgentName(agent)}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500 text-sm">No agents found</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Table (md+) */}
      <div className="overflow-x-auto">
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
                    <button className="text-blue-600 hover:text-blue-800 p-2 rounded" onClick={() => handleView(agent)}>
                      <HiEye size={20} className="cursor-pointer" />
                    </button>
                    <button className="text-green-600 hover:text-green-800 p-2 rounded" onClick={() => handleEditClick(agent)}>
                      <HiPencil size={20} className="cursor-pointer" />
                    </button>
                    <button
                      onClick={() => handleVerify(agent._id, agent.isVerified)}
                      className={`px-3 py-1 rounded text-xs ${agent.isVerified ? "bg-green-500 text-white" : "bg-gray-300 text-black"}`}
                    >
                      {agent.isVerified ? "Verified" : "Verify"}
                    </button>
                    <button className="text-red-600 hover:text-red-800 p-2 rounded" onClick={() => handleDelete(agent._id)}>
                      <HiTrash size={20} className="cursor-pointer" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredAgents.length === 0 && (
              <tr><td colSpan="4" className="text-center py-4 text-gray-500">No agents found.</td></tr>
            )}
          </tbody>
        </table>

        {/* Card view (mobile) */}
        <div className="flex flex-col space-y-4 md:hidden">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent, index) => {
              const agentName = getAgentName(agent);
              return (
                <div key={index} className="bg-white rounded-2xl shadow-md p-4 flex flex-col space-y-2">
                  <div className="text-lg font-semibold text-[#2563eb]">{agentName}</div>
                  <div className="text-sm text-gray-700"><strong>Email:</strong> {agent.email}</div>
                  <div className="text-sm text-gray-700"><strong>Phone:</strong> {agent.phone}</div>
                  <div className="flex gap-4 mt-2">
                    <button className="text-blue-600 hover:text-blue-800 p-2 rounded" onClick={() => handleView(agent)}>
                      <HiEye size={20} className="cursor-pointer" />
                    </button>
                    <button className="text-green-600 hover:text-green-800 p-2 rounded" onClick={() => handleEditClick(agent)}>
                      <HiPencil size={20} className="cursor-pointer" />
                    </button>
                    <button
                      onClick={() => handleVerify(agent._id, agent.isVerified)}
                      className={`px-3 py-1 rounded text-xs ${agent.isVerified ? "bg-green-500 text-white" : "bg-gray-300 text-black"}`}
                    >
                      {agent.isVerified ? "Verified" : "Verify"}
                    </button>
                    <button className="text-red-600 hover:text-red-800 p-2 rounded" onClick={() => handleDelete(agent._id)}>
                      <HiTrash size={20} className="cursor-pointer" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-gray-500">No agents found.</div>
          )}
        </div>
      </div>

      {/* ── VIEW MODAL ─────────────────────────────────── */}
      {selectedAgent && !showEditModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#1e3a8a]">Agent Details</h2>
                <p className="text-sm text-gray-500">Full record from the database</p>
              </div>
              <button className="text-gray-500 hover:text-gray-900" onClick={handleCloseView}>✕</button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ViewRow label="Name"  value={getAgentName(selectedAgent)} />
              <ViewRow label="Email" value={selectedAgent.email} />
              <ViewRow label="Phone" value={selectedAgent.phone} />
              <ViewRow label="Role"  value={selectedAgent.role} />
              <ViewRow label="Active"   value={selectedAgent.isActive   ? "Yes" : "No"} />
              <ViewRow label="Verified" value={selectedAgent.isVerified ? "Yes" : "No"} />
              {selectedAgent.company && <ViewRow label="Company" value={selectedAgent.company} fullWidth />}
              <ViewRow label="Registered Email" value={selectedAgent.registeredEmail} fullWidth />
              <ViewRow label="Secondary Email"  value={selectedAgent.secondaryEmail}  fullWidth />
              {selectedAgent.photo && (
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-sm text-gray-500">Photo</p>
                  <img src={selectedAgent.photo} alt="Agent" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                </div>
              )}
              <ViewRow label="Company Address" value={formatAddress(selectedAgent.companyAddress)} fullWidth />
              <ViewRow label="Branch Address"  value={formatAddress(selectedAgent.branchAddress)}  fullWidth />
              {selectedAgent.profileCompletedAt && (
                <ViewRow label="Profile Completed At" value={new Date(selectedAgent.profileCompletedAt).toLocaleString()} fullWidth />
              )}
              <ViewRow label="Created" value={selectedAgent.createdAt ? new Date(selectedAgent.createdAt).toLocaleString() : "N/A"} fullWidth />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700" onClick={() => handleEditClick(selectedAgent)}>Edit</button>
              <button className="rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700" onClick={() => handleDelete(selectedAgent._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ─────────────────────────────────── */}
      {showEditModal && selectedAgent && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#1e3a8a]">Edit Agent</h2>
                <p className="text-sm text-gray-500">Update the fields below and save changes.</p>
              </div>
              <button className="text-gray-500 hover:text-gray-900" onClick={() => setShowEditModal(false)}>✕</button>
            </div>

            <form className="space-y-5" onSubmit={handleSaveEdit}>

              <SectionLabel title="Basic Information" />
              <div className="grid gap-4 sm:grid-cols-2">
                <EditField label="First Name" name="firstName" value={editData.firstName} onChange={handleEditChange} />
                <EditField label="Last Name"  name="lastName"  value={editData.lastName}  onChange={handleEditChange} />
                <EditField label="Email" name="email" type="email" value={editData.email} onChange={handleEditChange} />
                <EditField label="Phone" name="phone" value={editData.phone} onChange={handleEditChange} />
              </div>

              <SectionLabel title="Additional Information" />
              <div className="grid gap-4 sm:grid-cols-2">
                <EditField label="Registered Email" name="registeredEmail" type="email" value={editData.registeredEmail} onChange={handleEditChange} />
                <EditField label="Secondary Email"  name="secondaryEmail"  type="email" value={editData.secondaryEmail}  onChange={handleEditChange} />
              </div>
              <EditField label="Photo URL" name="photo" value={editData.photo} onChange={handleEditChange} />

              <SectionLabel title="Company Address" />
              <div className="grid gap-4 sm:grid-cols-2">
                <EditField label="House / Flat No." name="houseNo"    value={editData.companyAddress.houseNo}    onChange={handleAddressChange("companyAddress")} />
                <EditField label="Street"           name="street"     value={editData.companyAddress.street}     onChange={handleAddressChange("companyAddress")} />
                <EditField label="Area / Locality"  name="area"       value={editData.companyAddress.area}       onChange={handleAddressChange("companyAddress")} />
                <EditField label="City"             name="city"       value={editData.companyAddress.city}       onChange={handleAddressChange("companyAddress")} />
                <EditField label="State"            name="state"      value={editData.companyAddress.state}      onChange={handleAddressChange("companyAddress")} />
                <EditField label="Postal Code"      name="postalCode" value={editData.companyAddress.postalCode} onChange={handleAddressChange("companyAddress")} />
              </div>
              <EditField label="Country" name="country" value={editData.companyAddress.country} onChange={handleAddressChange("companyAddress")} />

              <SectionLabel title="Branch Address" />
              <div className="grid gap-4 sm:grid-cols-2">
                <EditField label="House / Flat No." name="houseNo"    value={editData.branchAddress.houseNo}    onChange={handleAddressChange("branchAddress")} />
                <EditField label="Street"           name="street"     value={editData.branchAddress.street}     onChange={handleAddressChange("branchAddress")} />
                <EditField label="Area / Locality"  name="area"       value={editData.branchAddress.area}       onChange={handleAddressChange("branchAddress")} />
                <EditField label="City"             name="city"       value={editData.branchAddress.city}       onChange={handleAddressChange("branchAddress")} />
                <EditField label="State"            name="state"      value={editData.branchAddress.state}      onChange={handleAddressChange("branchAddress")} />
                <EditField label="Postal Code"      name="postalCode" value={editData.branchAddress.postalCode} onChange={handleAddressChange("branchAddress")} />
              </div>
              <EditField label="Country" name="country" value={editData.branchAddress.country} onChange={handleAddressChange("branchAddress")} />

              <div className="mt-6 flex flex-wrap gap-3">
                <button type="submit" disabled={isSaving} className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-60">
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
                <button type="button" className="rounded-xl border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-100" onClick={() => setShowEditModal(false)}>
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