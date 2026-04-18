import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileButton from "./ProfileButton";
import { HiUsers } from "react-icons/hi2";

// ── Helpers defined OUTSIDE the component so they are never re-created on re-render ──

const SectionTitle = ({ title }) => (
  <div className="border-b border-gray-200 pb-2 mt-2">
    <h2 className="text-base font-semibold text-blue-700">{title}</h2>
  </div>
);

const Field = ({ label, id, name, type = "text", required = false, placeholder, value, onChange }) => (
  <div className="flex flex-col w-full">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name || id}
      value={value}
      onChange={onChange}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      required={required}
      className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const AddAgentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    registeredEmail: "",
    secondaryEmail: "",
    photo: "",
    companyHouseNo: "",
    companyStreet: "",
    companyArea: "",
    companyCity: "",
    companyState: "",
    companyPostalCode: "",
    companyCountry: "",
    branchHouseNo: "",
    branchStreet: "",
    branchArea: "",
    branchCity: "",
    branchState: "",
    branchPostalCode: "",
    branchCountry: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const apiBase = import.meta.env.VITE_API_BASE || "";

      await axios.post(
        `${apiBase}/api/agents`,
        {
          firstName: formData.firstname,
          lastName: formData.lastname,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          registeredEmail: formData.registeredEmail || formData.email,
          secondaryEmail: formData.secondaryEmail,
          photo: formData.photo,
          companyAddress: {
            houseNo: formData.companyHouseNo,
            street: formData.companyStreet,
            area: formData.companyArea,
            city: formData.companyCity,
            state: formData.companyState,
            postalCode: formData.companyPostalCode,
            country: formData.companyCountry,
          },
          branchAddress: {
            houseNo: formData.branchHouseNo,
            street: formData.branchStreet,
            area: formData.branchArea,
            city: formData.branchCity,
            state: formData.branchState,
            postalCode: formData.branchPostalCode,
            country: formData.branchCountry,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Agent created successfully");
      navigate("/allagents");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Error creating agent");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-4 py-6 sm:px-8 rounded-2xl max-w-7xl mx-auto">
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

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Basic Info ─────────────────────────────── */}
        <SectionTitle title="Basic Information" />

        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <Field label="First Name" id="firstname" value={formData.firstname} onChange={handleChange} required placeholder="Enter first name" />
          <Field label="Last Name" id="lastname" value={formData.lastname} onChange={handleChange} placeholder="Enter last name" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <Field label="Email" id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Enter agent email" />
          <Field label="Phone Number" id="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="Enter phone number" />
        </div>

        <div className="flex flex-col w-full max-w-md">
          <Field label="Create Password" id="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Enter secure password" />
          
        </div>

        {/* ── Additional Info ────────────────────────── */}
        <SectionTitle title="Additional Information" />

        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <Field label="Registered Email" id="registeredEmail" type="email" value={formData.registeredEmail} onChange={handleChange} placeholder="Defaults to email if empty" />
          <Field label="Secondary Email" id="secondaryEmail" type="email" value={formData.secondaryEmail} onChange={handleChange} placeholder="Enter secondary email" />
        </div>

        <div className="flex flex-col w-full max-w-md">
          <Field label="Photo URL" id="photo" value={formData.photo} onChange={handleChange} placeholder="https://example.com/photo.jpg" />
        </div>

        {/* ── Company Address ────────────────────────── */}
        <SectionTitle title="Company Address" />

        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <Field label="House / Flat No." id="companyHouseNo" value={formData.companyHouseNo} onChange={handleChange} placeholder="e.g. 12A" />
          <Field label="Street" id="companyStreet" value={formData.companyStreet} onChange={handleChange} placeholder="e.g. MG Road" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <Field label="Area / Locality" id="companyArea" value={formData.companyArea} onChange={handleChange} placeholder="e.g. Connaught Place" />
          <Field label="City" id="companyCity" value={formData.companyCity} onChange={handleChange} placeholder="e.g. New Delhi" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <Field label="State" id="companyState" value={formData.companyState} onChange={handleChange} placeholder="e.g. Delhi" />
          <Field label="Postal Code" id="companyPostalCode" value={formData.companyPostalCode} onChange={handleChange} placeholder="e.g. 110001" />
        </div>

        <div className="flex flex-col w-full max-w-md">
          <Field label="Country" id="companyCountry" value={formData.companyCountry} onChange={handleChange} placeholder="e.g. India" />
        </div>

        {/* ── Branch Address ─────────────────────────── */}
        <SectionTitle title="Branch Address" />

        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <Field label="House / Flat No." id="branchHouseNo" value={formData.branchHouseNo} onChange={handleChange} placeholder="e.g. 5B" />
          <Field label="Street" id="branchStreet" value={formData.branchStreet} onChange={handleChange} placeholder="e.g. Park Street" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <Field label="Area / Locality" id="branchArea" value={formData.branchArea} onChange={handleChange} placeholder="e.g. Lajpat Nagar" />
          <Field label="City" id="branchCity" value={formData.branchCity} onChange={handleChange} placeholder="e.g. Mumbai" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <Field label="State" id="branchState" value={formData.branchState} onChange={handleChange} placeholder="e.g. Maharashtra" />
          <Field label="Postal Code" id="branchPostalCode" value={formData.branchPostalCode} onChange={handleChange} placeholder="e.g. 400001" />
        </div>

        <div className="flex flex-col w-full max-w-md">
          <Field label="Country" id="branchCountry" value={formData.branchCountry} onChange={handleChange} placeholder="e.g. India" />
        </div>

        {/* ── Submit ─────────────────────────────────── */}
        <button
          type="submit"
          className="cursor-pointer bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition w-full max-w-md"
        >
          Save Agent
        </button>
      </form>
    </div>
  );
};

export default AddAgentForm;