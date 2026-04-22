import React, { useState, useEffect } from 'react';
import { HiGlobeAlt, HiLocationMarker, HiPhotograph, HiPencil, HiTrash } from 'react-icons/hi';
import ProfileButton from '../components/ProfileButton';

const CreateDestination = () => {
  const [destinationType, setDestinationType] = useState('Domestic');
  const [destinationName, setDestinationName] = useState('');
  const [categories, setCategories] = useState({
    Trending: false,
    Exclusive: false,
    Weekend: false,
    Home: false,
    Honeymoon: false,
  });
  const [images, setImages] = useState(null);
  const [destinations, setDestinations] = useState(() => {
    const saved = localStorage.getItem('destinations');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Andaman', type: 'Domestic' },
      { id: 2, name: 'Andhra Pradesh', type: 'Domestic' },
      { id: 3, name: 'Arunachal Pradesh', type: 'Domestic' },
      { id: 4, name: 'Assam', type: 'Domestic' },
      { id: 5, name: 'Bangalore', type: 'Domestic' },
      { id: 6, name: 'Chhattisgarh', type: 'Domestic' },
      { id: 7, name: 'Bali', type: 'International' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('destinations', JSON.stringify(destinations));
  }, [destinations]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);

  const handleCategoryChange = (category) => {
    setCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleEditCategoryChange = (category) => {
    setEditingDestination(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!destinationName) return;
    
    // Duplicate check
    const isDuplicate = destinations.some(
      (d) => d.name.toLowerCase() === destinationName.trim().toLowerCase()
    );

    if (isDuplicate) {
      alert("This destination already exists!");
      return;
    }

    const newDestination = {
      id: Date.now(),
      name: destinationName.trim(),
      type: destinationType,
      categories: Object.keys(categories).filter(c => categories[c]),
      images: [
        { id: 1, name: 'Existing 0' },
        { id: 2, name: 'Existing 1' },
        { id: 3, name: 'Existing 2' },
      ]
    };
    
    setDestinations([...destinations, newDestination]);
    setDestinationName('');
    setCategories({
      Trending: false,
      Exclusive: false,
      Weekend: false,
      Home: false,
      Honeymoon: false,
    });
    setImages(null);
  };

  const handleEdit = (dest) => {
    setEditingDestination({ ...dest, categories: dest.categories || [] });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    // Duplicate check for update
    const isDuplicate = destinations.some(
      (d) => d.id !== editingDestination.id && d.name.toLowerCase() === editingDestination.name.trim().toLowerCase()
    );

    if (isDuplicate) {
      alert("Another destination with this name already exists!");
      return;
    }

    setDestinations(destinations.map(d => d.id === editingDestination.id ? { ...editingDestination, name: editingDestination.name.trim() } : d));
    setIsEditModalOpen(false);
    setEditingDestination(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      setDestinations(destinations.filter(d => d.id !== id));
    }
  };

  const filteredDestinations = destinations.filter(d => d.type === destinationType);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
          <h1 className="text-3xl font-bold text-gray-900 font-sans">Create New Destination</h1>
          <ProfileButton />
        </header>



        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 mb-8">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Destination Type */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
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
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Destination Name */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <HiLocationMarker className="text-blue-500 text-lg" />
                Destination Name
              </label>
              <input
                type="text"
                placeholder="e.g., Goa, Paris"
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
              />
            </div>

            {/* Destination Categories */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 block">Destination Categories</label>
              <div className="flex flex-wrap gap-4">
                {Object.keys(categories).map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={categories[cat]}
                      onChange={() => handleCategoryChange(cat)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors font-medium">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Upload Images */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <HiPhotograph className="text-blue-500 text-lg" />
                Upload Images
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  multiple
                  onChange={(e) => setImages(e.target.files)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-200 active:transform active:scale-95"
            >
              Save Destination
            </button>
          </form>
        </div>

        {/* Destination List */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900 font-sans">{destinationType} Destinations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider font-sans">Destination Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right font-sans">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {filteredDestinations.map((dest) => (
                  <tr key={dest.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 text-gray-700 font-medium">{dest.name}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button 
                        onClick={() => handleEdit(dest)}
                        className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-all"
                      >
                        <HiPencil className="text-xl" />
                      </button>
                      <button 
                        onClick={() => handleDelete(dest.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all"
                      >
                        <HiTrash className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDestinations.length === 0 && (
              <div className="p-12 text-center text-gray-500 italic font-sans">
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
                <h2 className="text-2xl font-bold text-gray-900 font-sans">Edit Destination</h2>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Destination Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 font-sans">Destination Type</label>
                  <select
                    value={editingDestination.type}
                    onChange={(e) => setEditingDestination({ ...editingDestination, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  >
                    <option value="Domestic">Domestic</option>
                    <option value="International">International</option>
                  </select>
                </div>

                {/* Destination Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 font-sans">Destination Name</label>
                  <input
                    type="text"
                    value={editingDestination.name}
                    onChange={(e) => setEditingDestination({ ...editingDestination, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 font-sans">Categories</label>
                  <div className="flex flex-wrap gap-4">
                    {['Trending', 'Exclusive', 'Weekend', 'Home', 'Honeymoon'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingDestination.categories.includes(cat)}
                          onChange={() => handleEditCategoryChange(cat)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-gray-700 font-medium">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Upload New Images */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 font-sans">Upload New Images</label>
                  <input
                    type="file"
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                  />
                </div>

                {/* Images Grid */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-gray-700 font-sans">Images</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {(editingDestination.images || []).map((img, idx) => (
                      <div key={idx} className="relative aspect-square bg-gray-100 rounded-xl border border-gray-200 group">
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                          {img.name}
                        </div>
                        <button 
                          type="button"
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                        <div className="absolute bottom-2 left-2">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                        </div>
                        {/* Placeholder for actual image */}
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <i className="fas fa-image text-3xl"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-200"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
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
