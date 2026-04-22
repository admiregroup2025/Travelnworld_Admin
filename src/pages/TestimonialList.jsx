import React, { useState } from 'react';
import { HiLocationMarker, HiTrash, HiSearch, HiFilter } from 'react-icons/hi';
import ProfileButton from '../components/ProfileButton';

const TestimonialList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      title: 'Mr & Mrs. Parmar-Honeymoon Couple',
      location: 'Himachal',
      visibility: 'Public',
      date: '3/23/2026',
      videoUrl: '#'
    },
    {
      id: 2,
      title: 'Dr.Mothukuri Sundariayah & Family',
      location: 'Uttarakhand & Himachal',
      visibility: 'Public',
      date: '3/23/2026',
      videoUrl: '#'
    },
    {
      id: 3,
      title: 'Mr and Mrs Chaturvedi',
      location: 'Maldives',
      visibility: 'Public',
      date: '7/22/2025',
      videoUrl: '#'
    },
    {
      id: 4,
      title: 'The Sharma Family Vacation',
      location: 'Rajasthan',
      visibility: 'Public',
      date: '1/15/2026',
      videoUrl: '#'
    },
    {
      id: 5,
      title: 'Solo Trip Highlights - Rohan',
      location: 'Manali',
      visibility: 'Private',
      date: '12/10/2025',
      videoUrl: '#'
    }
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  const filteredTestimonials = testimonials.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Testimonial List</h1>
            <p className="text-slate-500 mt-1">Manage all your video testimonials in one place.</p>
          </div>
          <ProfileButton />
        </header>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50/50"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all">
              <HiFilter />
              Filters
            </button>
            <button className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
              New Testimonial
            </button>
          </div>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTestimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group hover:-translate-y-1">
              {/* Video Preview */}
              <div className="aspect-video bg-slate-900 relative flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-blue-600 transition-colors cursor-pointer">
                  <i className="fas fa-play text-white text-xl ml-1"></i>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                    t.visibility === 'Public' ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'
                  }`}>
                    {t.visibility}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 text-white/70 text-[10px] font-mono bg-black/20 backdrop-blur-sm px-2 py-1 rounded">
                  {t.date}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">{t.title}</h3>
                
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <HiLocationMarker className="text-blue-500" />
                  </div>
                  <span>{t.location}</span>
                </div>
                
                <div className="pt-2 border-t border-slate-50 flex gap-3">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="flex-1 bg-red-50 hover:bg-red-600 text-red-500 hover:text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <HiTrash />
                    Delete
                  </button>
                  <button className="w-12 h-12 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-500 rounded-xl flex items-center justify-center transition-all">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTestimonials.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiSearch className="text-slate-300 text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No testimonials found</h3>
            <p className="text-slate-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialList;
