import React from 'react';
import ProfileButton from './ProfileButton';

const Enquiry = () => {
  const data = [
    {
      name: "Amit Sharma",
      companyName: "TravelEase Pvt Ltd",
      mobileNumber: "+91 9876543210",
      email: "amit.sharma@travelease.com",
      location: "Mumbai, Maharashtra",
      requirements: "Need a platform to manage corporate travel bookings and invoicing.",
    },
    {
      name: "Priya Verma",
      companyName: "WanderWorld Holidays",
      mobileNumber: "+91 9123456789",
      email: "priya.verma@wanderworld.in",
      location: "Bangalore, Karnataka",
      requirements: "Looking for an API integration for flight and hotel booking services.",
    },
    {
      name: "Rohit Mehta",
      companyName: "GoTrip Adventures",
      mobileNumber: "+91 9988776655",
      email: "rohit.mehta@gotrip.com",
      location: "Delhi, India",
      requirements: "Need a booking engine for domestic tour packages with payment gateway support.",
    }
  ];

  return (
    <div className="min-h-screen w-full px-4 sm:px-8 py-6 bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-[15px] p-4 sm:p-6 rounded-[20px] border border-blue-600/20 mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] relative z-10">
        <div className="text-xl sm:text-2xl lg:text-[2rem] font-bold text-blue-600 flex items-center gap-3 sm:gap-4">
          <i className="fas fa-question-circle"></i>
          <span>Enquire</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <ProfileButton />
        </div>
      </header>

      {/* Responsive Table/Card */}
      <div className="overflow-x-auto">
        {/* Table for md and above */}
        <table className="min-w-[800px] w-full bg-white rounded-2xl shadow-md hidden md:table">
          <thead>
            <tr className="bg-[linear-gradient(45deg,rgba(37,99,235,0.1),rgba(220,38,38,0.1))] text-[#2563eb]">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Company</th>
              <th className="text-left py-3 px-4">Mobile</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Location</th>
              <th className="text-left py-3 px-4">Requirements</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-100 transition">
                <td className="py-3 px-4 font-medium">{entry.name}</td>
                <td className="py-3 px-4">{entry.companyName}</td>
                <td className="py-3 px-4">{entry.mobileNumber}</td>
                <td className="py-3 px-4">{entry.email}</td>
                <td className="py-3 px-4">{entry.location}</td>
                <td className="py-3 px-4">{entry.requirements}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Card view for small screens */}
        <div className="flex flex-col space-y-4 md:hidden">
          {data.length > 0 ? (
            data.map((entry, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-4 flex flex-col space-y-2"
              >
                <div className="text-lg font-semibold text-[#2563eb]">
                  {entry.name}
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Company:</strong> {entry.companyName}
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Mobile:</strong> {entry.mobileNumber}
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Email:</strong> {entry.email}
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Location:</strong> {entry.location}
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Requirements:</strong> {entry.requirements}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No enquiries found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Enquiry;