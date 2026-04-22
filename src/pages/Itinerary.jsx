import React, { useState, useEffect } from 'react';
import { HiOutlineMap, HiPencil, HiTrash } from 'react-icons/hi';
import ProfileButton from '../components/ProfileButton';
import img1 from '../assets/image/goa.jpg';
import img2 from '../assets/image/agra.png';
import img3 from '../assets/image/andaman.png';
import img4 from '../assets/image/darjeeling.jpg';
import AddItineraries  from '../components/AddItineraries';

const Itinerary = () => {
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
        "absolute rounded-full opacity-[0.03] animate-float bg-red-600";

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

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this itinerary?")) {
      setItinerary(itinerary.filter(item => item.id !== id));
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

        .itinerary-card-before {
          position: relative;
          overflow: hidden;
        }

        .itinerary-card-before::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(45deg, rgb(220, 38, 38), rgb(220, 38, 38));
        }
      `}</style>

      <div
        className="fixed top-0 left-0 w-full h-full -z-[1] overflow-hidden bg-slate-50"
        id="animatedBg"
      ></div>

      <div className="p-4 sm:p-6 min-h-screen relative">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-[15px] p-4 sm:p-6 rounded-[20px] border border-red-600/20 mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] relative z-10">
          <div className="text-xl sm:text-2xl lg:text-[2rem] font-bold text-red-600 flex items-center gap-3 sm:gap-4">
            <HiOutlineMap className="text-red-600 text-3xl" />
            <span>Itinerary</span>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <ProfileButton />
          </div>
        </header>

        {/* Search + Filters + Add Button */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-6 relative z-10">
          <input
            type="text"
            placeholder="Search queries..."
            className="flex-1 px-6 py-3 border border-red-600/20 rounded-full bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={tripType}
            onChange={(e) => {
              setTripType(e.target.value);
              setLocation('');
            }}
            className="px-6 py-3 border border-red-600/20 rounded-full bg-white/80 backdrop-blur-sm text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="All">All Types</option>
            <option value="Domestic">Domestic</option>
            <option value="International">International</option>
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-6 py-3 border border-red-600/20 rounded-full bg-white/80 backdrop-blur-sm text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-full shadow-[0_4px_15px_rgba(220,38,38,0.3)] hover:scale-105 transition-all"
          >
            <i className="fas fa-plus"></i> Add Itinerary
          </button>
        </div>

        {/* Itinerary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {filteredItinerary.map((item) => (
            <div
              key={item.id}
              className="group bg-white/90 backdrop-blur-md border border-red-600/10 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_rgba(220,38,38,0.15)] transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-bold uppercase tracking-wider">
                    {item.time}
                  </span>
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold">
                    {item.status}
                  </span>
                </div>
                
                {/* Action Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors shadow-lg">
                    <HiPencil size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors shadow-lg"
                  >
                    <HiTrash size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.type === 'Domestic' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{item.location}</span>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-red-600 transition-colors">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-1">{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Popup for Add User Form */}
        {showModal && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[30px] shadow-2xl relative animate-fadeIn">
              {/* Modal header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md p-6 border-b border-gray-100 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-red-600 flex items-center gap-3">
                  <i className="fas fa-plus-circle"></i>
                  Add New Itinerary
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-600 hover:text-white transition-all text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                <AddItineraries />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Itinerary;
