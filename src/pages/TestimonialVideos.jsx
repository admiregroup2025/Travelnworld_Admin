import React, { useState, useRef } from 'react';
import { HiVideoCamera, HiLocationMarker, HiTrash, HiPlus } from 'react-icons/hi';
import ProfileButton from '../components/ProfileButton';

const TestimonialVideos = () => {
  const fileInputRef = useRef(null);
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [visibility, setVisibility] = useState('Public');
  
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
    }
  ]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!title || !location) return;
    
    const newTestimonial = {
      id: Date.now(),
      title,
      location,
      visibility,
      date: new Date().toLocaleDateString(),
      videoUrl: '#'
    };
    
    setTestimonials([newTestimonial, ...testimonials]);
    setTitle('');
    setLocation('');
    setVideoFile(null);
    alert("Testimonial uploaded successfully!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900">Testimonials Videos</h1>
          <ProfileButton />
        </header>

        {/* Upload Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
            <i className="fas fa-th-large text-blue-600"></i>
            <h2 className="font-bold text-slate-800">Upload Video Testimonial</h2>
          </div>
          
          <form onSubmit={handleUpload} className="p-8 space-y-6">
            {/* Video File Upload */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <i className="fas fa-cloud-upload-alt text-slate-400"></i>
                Video File
              </label>
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-blue-400 transition-all cursor-pointer bg-white group"
              >
                <div className="flex flex-col items-center gap-3">
                  <HiVideoCamera className="text-blue-500 text-4xl group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-slate-700 font-bold">Click to upload or drag & drop</p>
                    <p className="text-slate-400 text-xs mt-1">A single video file (MP4, WebM)</p>
                  </div>
                </div>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="video/*"
                  className="hidden" 
                  onChange={(e) => setVideoFile(e.target.files[0])}
                />
              </div>
              {videoFile && <p className="text-sm text-green-600 font-medium">Selected: {videoFile.name}</p>}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <i className="fas fa-bars text-slate-400"></i>
                Title
              </label>
              <input
                type="text"
                placeholder="e.g., Summer Highlights"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <i className="fas fa-map-marker-alt text-slate-400"></i>
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., California, USA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <i className="fas fa-eye text-slate-400"></i>
                Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-blue-100"
            >
              Upload Testimonial
            </button>
          </form>
        </div>

        {/* Testimonial List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-2">
            <HiPlus className="text-green-500 text-2xl rotate-45" />
            <h2 className="text-xl font-bold text-slate-900">Testimonial List</h2>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Video Preview */}
                  <div className="aspect-video bg-black relative flex items-center justify-center">
                    <i className="fas fa-play text-white/50 text-4xl"></i>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-slate-900 line-clamp-1">{t.title}</h3>
                    
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <HiLocationMarker className="text-slate-300" />
                      <span>{t.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase">
                        {t.visibility}
                      </span>
                      <span className="text-slate-300 text-[11px]">{t.date}</span>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-100"
                    >
                      <HiTrash />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialVideos;
