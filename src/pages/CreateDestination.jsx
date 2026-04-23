import React, { useState, useEffect } from 'react';
import { HiGlobeAlt, HiLocationMarker, HiPhotograph, HiPencil, HiTrash } from 'react-icons/hi';
import ProfileButton from '../components/ProfileButton';
import axios from 'axios';


const CreateDestination = () => {
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  
  const [destinationType, setDestinationType] = useState('Domestic');
  const [destinationName, setDestinationName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [categories, setCategories] = useState({
    trending: false,
    exclusive: false,
    weekend: false,
    home: false,
    honeymoon: false,
  });
  const [images, setImages] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);

  // Fetch destinations from API
  useEffect(() => {
    fetchDestinations();
  }, [destinationType]);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const type = destinationType.toLowerCase();
      const response = await axios.get(`${API_BASE}/api/destinations/type/${type}`);
      setDestinations(response.data.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching destinations:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('twz_auth_token');
        window.location.href = '/login';
        return;
      }
      setError('Failed to load destinations');
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  }

  //const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  //const [editingDestination, setEditingDestination] = useState(null);

  const handleCategoryChange = (category) => {
    setCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const getAuthToken = () => {
    let token = localStorage.getItem('token') || localStorage.getItem('twz_auth_token');
    if (token) {
      token = token.replace(/^["']|["']$/g, '');
    }
    if (!token || token === "undefined" || token === "null") return null;
    
    // Check if it's a valid JWT format (3 parts)
    if (token.split('.').length !== 3) {
      localStorage.removeItem('token');
      localStorage.removeItem('twz_auth_token');
      return null;
    }
    return token;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!destinationName.trim()) {
      setError('Destination name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const token = getAuthToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('name', destinationName.trim());
      formData.append('type', destinationType.toLowerCase());
      formData.append('shortDescription', shortDescription);
      formData.append('categories', JSON.stringify(categories));
      
      if (coverImageFile) {
        formData.append('coverImage', coverImageFile);
      }

      const response = await axios.post(
        `${API_BASE}/api/destinations`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccess('Destination created successfully!');
      setDestinationName('');
      setShortDescription('');
      setCoverImageFile(null);
      setCategories({
        trending: false,
        exclusive: false,
        weekend: false,
        home: false,
        honeymoon: false,
      });
      setImages(null);
      
      // Refresh list
      await fetchDestinations();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error creating destination:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('twz_auth_token');
        window.location.href = '/login';
        return;
      }
      setError(err.response?.data?.message || 'Failed to create destination');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dest) => {
    setEditingDestination({ ...dest });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const token = getAuthToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('name', editingDestination.name);
      formData.append('type', editingDestination.type?.toLowerCase() || 'domestic');
      formData.append('shortDescription', editingDestination.shortDescription || '');
      formData.append('categories', JSON.stringify(editingDestination.categories || {}));
      
      if (editingDestination.newCoverImageFile) {
        formData.append('coverImage', editingDestination.newCoverImageFile);
      } else if (editingDestination.coverImageUrl) {
        formData.append('coverImageUrl', editingDestination.coverImageUrl);
      }

      await axios.put(
        `${API_BASE}/api/destinations/${editingDestination._id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccess('Destination updated successfully!');
      setIsEditModalOpen(false);
      setEditingDestination(null);
      
      // Refresh list
      await fetchDestinations();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating destination:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('twz_auth_token');
        window.location.href = '/login';
        return;
      }
      setError(err.response?.data?.message || 'Failed to update destination');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        setLoading(true);
        setError('');
        
        const token = getAuthToken();
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        await axios.delete(
          `${API_BASE}/api/destinations/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        setSuccess('Destination deleted successfully!');
        
        // Refresh list
        await fetchDestinations();
        
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error deleting destination:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('twz_auth_token');
          window.location.href = '/login';
          return;
        }
        setError(err.response?.data?.message || 'Failed to delete destination');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredDestinations = destinations.filter(d => d.type === destinationType);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 mb-8 shadow-xl shadow-blue-900/20 text-white flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Create New Destination</h1>
            <p className="text-blue-200 font-medium">Manage and add exciting travel locations to your platform.</p>
          </div>
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
             <ProfileButton />
          </div>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left Column - Instructions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sticky top-8">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <HiGlobeAlt className="text-2xl" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Destination Details</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Fill out the form to add a new destination. Ensure you use high-quality cover images to attract more users.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                  <p className="text-sm text-slate-600">Keep descriptions short and catchy</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                  <p className="text-sm text-slate-600">Use 1200x800px images for best results</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                  <p className="text-sm text-slate-600">Select accurate categories</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow p-8">
          {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">{error}</div>}
          {success && <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">{success}</div>}
          
          <form onSubmit={handleSave} className="space-y-6">
            {/* Destination Type */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <HiGlobeAlt className="text-blue-500 text-lg" />
                Destination Type
              </label>
              <div className="flex gap-6">
                {['Domestic', 'International'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="destinationType"
                      value={type}
                      checked={destinationType === type}
                      onChange={(e) => setDestinationType(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span className="text-slate-700 group-hover:text-blue-600 transition-colors font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Destination Name */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <HiLocationMarker className="text-blue-500 text-lg" />
                Destination Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Goa, Paris"
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Short Description */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Short Description</label>
              <input
                type="text"
                placeholder="Brief description for cards"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>



            {/* Cover Image Upload */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <HiPhotograph className="text-blue-500 text-lg" />
                Cover Image Upload
              </label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-blue-300 border-dashed rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg aria-hidden="true" className="w-10 h-10 mb-3 text-blue-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="mb-2 text-sm text-slate-600"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-slate-500">SVG, PNG, JPG or WEBP (Recommended: 1200x800px)</p>
                    {coverImageFile && <p className="mt-3 text-sm text-green-600 font-bold max-w-[250px] truncate bg-green-100 px-3 py-1 rounded-full">{coverImageFile.name}</p>}
                  </div>
                  <input id="dropzone-file" type="file" accept="image/*" className="hidden" onChange={(e) => setCoverImageFile(e.target.files[0])} />
                </label>
              </div>
            </div>



            {/* Destination Categories */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 block">Destination Categories</label>
              <div className="flex flex-wrap gap-4">
                {Object.keys(categories).map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={categories[cat]}
                      onChange={() => handleCategoryChange(cat)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span className="text-slate-700 group-hover:text-blue-600 transition-colors font-medium capitalize">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-200 active:transform active:scale-95"
            >
              {loading ? 'Saving...' : 'Save Destination'}
            </button>
          </form>
            </div>
          </div>
        </div>

        {/* Destination List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow overflow-hidden mb-12">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-900 font-sans">{destinationType} Destinations ({destinations.length})</h2>
          </div>
          <div className="overflow-x-auto">
            {loading && destinations.length === 0 ? (
              <div className="p-12 text-center text-slate-500">Loading destinations...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider font-sans">Destination Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider font-sans">Categories</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right font-sans">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-sans">
                  {destinations.map((dest) => (
                    <tr key={dest._id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4 text-slate-700 font-medium">{dest.name}</td>
                      <td className="px-6 py-4 text-slate-700 text-xs">
                        {Object.entries(dest.categories || {})
                          .filter(([, v]) => v)
                          .map(([k]) => k)
                          .join(', ') || '-'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button 
                          onClick={() => handleEdit(dest)}
                          className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-all"
                        >
                          <HiPencil className="text-xl" />
                        </button>
                        <button 
                          onClick={() => handleDelete(dest._id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all"
                        >
                          <HiTrash className="text-xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && destinations.length === 0 && (
              <div className="p-12 text-center text-slate-500 italic font-sans">
                No {destinationType.toLowerCase()} destinations found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Destination Modal */}
      {isEditModalOpen && editingDestination && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 font-sans">Edit Destination</h2>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">{error}</div>}
              {success && <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">{success}</div>}

              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Destination Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 font-sans">Destination Type</label>
                  <select
                    value={editingDestination.type || 'domestic'}
                    onChange={(e) => setEditingDestination({ ...editingDestination, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  >
                    <option value="domestic">Domestic</option>
                    <option value="international">International</option>
                  </select>
                </div>

                {/* Destination Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 font-sans">Destination Name</label>
                  <input
                    type="text"
                    value={editingDestination.name || ''}
                    onChange={(e) => setEditingDestination({ ...editingDestination, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 font-sans">Short Description</label>
                  <input
                    type="text"
                    value={editingDestination.shortDescription || ''}
                    onChange={(e) => setEditingDestination({ ...editingDestination, shortDescription: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  />
                </div>



                {/* Cover Image Upload */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 font-sans">Cover Image Upload</label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file-edit" className="flex flex-col items-center justify-center w-full h-40 border-2 border-blue-300 border-dashed rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg aria-hidden="true" className="w-10 h-10 mb-3 text-blue-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-slate-600"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-slate-500">SVG, PNG, JPG or WEBP (Recommended: 1200x800px)</p>
                        {editingDestination.newCoverImageFile && <p className="mt-3 text-sm text-green-600 font-bold max-w-[250px] truncate bg-green-100 px-3 py-1 rounded-full">{editingDestination.newCoverImageFile.name}</p>}
                      </div>
                      <input id="dropzone-file-edit" type="file" accept="image/*" className="hidden" onChange={(e) => setEditingDestination({ ...editingDestination, newCoverImageFile: e.target.files[0] })} />
                    </label>
                  </div>
                  {editingDestination.coverImageUrl && !editingDestination.newCoverImageFile && (
                    <div className="mt-3 flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <img src={editingDestination.coverImageUrl} alt="Current Cover" className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                      <div className="flex-1 min-w-0">
                         <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Current Image</p>
                         <p className="text-sm text-slate-700 truncate">{editingDestination.coverImageUrl}</p>
                      </div>
                    </div>
                  )}
                </div>



                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 font-sans">Categories</label>
                  <div className="flex flex-wrap gap-4">
                    {['trending', 'exclusive', 'weekend', 'home', 'honeymoon'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingDestination.categories?.[cat] || false}
                          onChange={() => setEditingDestination({ 
                            ...editingDestination, 
                            categories: { 
                              ...editingDestination.categories, 
                              [cat]: !editingDestination.categories?.[cat] 
                            } 
                          })}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span className="text-slate-700 font-medium capitalize">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-200"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateDestination;
