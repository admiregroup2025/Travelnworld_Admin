import React, { useState } from "react";
import ProfileButton from "../components/ProfileButton"; // Adjust path as needed

import img1 from "../assets/image/goa.jpg";
import img2 from "../assets/image/agra.png";
import img3 from "../assets/image/andaman.png";
import img4 from "../assets/image/goa.jpg";

const dummyBanners = [
  {
    id: 1,
    image: img1,
    title: "Goa Vacation",
    desc: "Travel Co.",
    startDate: "2025-10-01",
    endDate: "2025-10-15",
  },
  {
    id: 2,
    image: img2,
    title: "Agra Tour",
    desc: "Monumental Trips",
    startDate: "2025-11-01",
    endDate: "2025-11-10",
  },
  {
    id: 3,
    image: img3,
    title: "Kerala Escape",
    desc: "Nature Trails",
    startDate: "2025-12-01",
    endDate: "2025-12-20",
  },
  {
    id: 4,
    image: img4,
    title: "Goa Special",
    desc: "Travel Co.",
    startDate: "2025-12-21",
    endDate: "2025-12-30",
  },
];

const HomeTopBanner = () => {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter logic: search in title or desc for better UX
 const filteredBanners = dummyBanners.filter((banner) => {
  const matchesSearch =
    banner.title.toLowerCase().includes(search.toLowerCase()) ||
    banner.desc.toLowerCase().includes(search.toLowerCase());

  const bannerStart = new Date(banner.startDate);
  const bannerEnd = new Date(banner.endDate);
  const filterStart = startDate ? new Date(startDate) : null;
  const filterEnd = endDate ? new Date(endDate) : null;

  const matchesStart = filterStart ? bannerStart >= filterStart : true;
  const matchesEnd = filterEnd ? bannerEnd <= filterEnd : true;

  return matchesSearch && matchesStart && matchesEnd;
});


  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white px-6 py-4 rounded-xl shadow mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Home Top Banners</h1>
        <ProfileButton />
      </div>

      {/* Search + Date Filters */}
      <div className="flex flex-col md:flex-row items-stretch gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or description..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-col">
          <label
            htmlFor="startDate"
            className="text-xs text-gray-700 font-medium mb-1"
          >
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full md:w-auto"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="endDate"
            className="text-xs text-gray-700 font-medium mb-1"
          >
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full md:w-auto"
          />
        </div>
      </div>

      {/* Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredBanners.length === 0 && (
          <p className="col-span-full text-center text-gray-500 mt-10">
            No banners found matching your criteria.
          </p>
        )}
        {filteredBanners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition duration-300"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h3 className="text-base font-semibold mb-1 text-gray-900">
                {banner.title}
              </h3>
              <p className="text-sm text-gray-700 mb-2">{banner.desc}</p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Start:</span> {banner.startDate}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold">End:</span> {banner.endDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeTopBanner;
