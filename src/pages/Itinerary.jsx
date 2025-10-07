import React, { useState } from 'react';
import { HiOutlineMap } from 'react-icons/hi';
import ProfileButton from '../components/ProfileButton';
import img1 from '../assets/image/goa.jpg';
import img2 from '../assets/image/agra.png';
import img3 from '../assets/image/andaman.png';
import img4 from '../assets/image/darjeeling.jpg';
import AddItineraries  from '../components/AddItineraries';

const Itinerary = () => {
  const [search, setSearch] = useState('');
  const [tripType, setTripType] = useState('All');
  const [location, setLocation] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    type: 'Domestic',
    location: '',
    image: '',
  });

  const [itinerary, setItinerary] = useState([
    {
      id: 'h1',
      name: 'The Grand Resort',
      title: 'Luxury Stay in Goa',
      location: 'Goa',
      type: 'Domestic',
      image: img1,
      time: '2 hours ago',
      status: '✓ Success',
    },
    {
      id: 'h2',
      name: 'Snow Valley Retreat',
      title: 'Adventure in Manali',
      location: 'Manali',
      type: 'Domestic',
      image: img2,
      time: '5 hours ago',
      status: '✓ Success',
    },
    {
      id: 'h3',
      name: 'Backwater Bliss',
      title: 'Romantic Getaway in Kerala',
      location: 'Kerala',
      type: 'Domestic',
      image: img3,
      time: '1 day ago',
      status: '✓ Success',
    },
    {
      id: 'h4',
      name: 'Parisian Nights',
      title: 'City of Lights - France',
      location: 'France',
      type: 'International',
      image: img4,
      time: '3 days ago',
      status: '✓ Success',
    },
  ]);

  const domesticCities = ['Goa', 'Manali', 'Kerala'];
  const internationalCountries = ['France', 'Japan', 'Italy'];

  const getLocationOptions = () => {
    if (tripType === 'Domestic') return domesticCities;
    if (tripType === 'International') return internationalCountries;
    return ['All Locations'];
  };

  const filteredItinerary = itinerary.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase());

    const matchesTripType = tripType === 'All' || item.type === tripType;

    const matchesLocation =
      location === '' || location === 'All Locations' || item.location === location;

    return matchesSearch && matchesTripType && matchesLocation;
  });

  const handleAddItinerary = (e) => {
    e.preventDefault();

    const newItem = {
      id: `id_${Date.now()}`,
      name: formData.name,
      title: formData.title,
      type: formData.type,
      location: formData.location,
      image: formData.image || img1,
      time: 'Just now',
      status: '✓ Success',
    };

    setItinerary([newItem, ...itinerary]);
    setShowModal(false);
    setFormData({ name: '', title: '', type: 'Domestic', location: '', image: '' });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-xl border border-[rgba(37,99,235,0.2)] rounded-2xl shadow-md mb-6 px-6 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div className="flex items-center text-blue-600 text-2xl font-bold gap-4">
          <HiOutlineMap className="text-[#2563eb] text-3xl" />
          <span className="text-3xl font-bold">Itinerary</span>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <ProfileButton />
        </div>
      </header>

      {/* Search + Filters + Add Button */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search queries..."
          className="flex-1 px-4 py-3 border border-blue-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={tripType}
          onChange={(e) => {
            setTripType(e.target.value);
            setLocation('');
          }}
          className="px-4 py-2 border border-blue-200 rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All</option>
          <option value="Domestic">Domestic</option>
          <option value="International">International</option>
        </select>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-4 py-2 border border-blue-200 rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {getLocationOptions().map((loc, idx) => (
            <option key={idx} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Add Itinerary Button */}
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
        >
          <span className="text-lg">➕</span> Add Itinerary
        </button>
      </div>

      {/* Itinerary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItinerary.map((item) => (
          <div
            key={item.id}
            className="relative w-full h-[200px] rounded-[20px] overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(37,99,235,0.15)]"
            style={{
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute top-0 left-0 right-0 bg-white/70 backdrop-blur-sm px-3 py-1 flex justify-between text-xs text-gray-700 font-semibold">
              <span>{item.time}</span>
              <span className="text-green-600">{item.status}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2 text-white font-semibold bg-gradient-to-t from-black/70 to-transparent">
              <h4 className="text-base">{item.name}</h4>
              <p className="text-xs">{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup for Add User Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ">
            <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-4 shadow-2xl relative animate-fadeIn">
            {/* Modal header */}
            <h2 className="text-xl font-semibold text-blue-600">
                Add New Itinerary
            </h2>

            <AddItineraries />

            <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-4xl font-bold"
            >
                ×
            </button>
            </div>
        </div>
        )}
    </div>
  );
};

export default Itinerary;
