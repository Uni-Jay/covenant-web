import { useState, useEffect } from 'react';
import { galleryAPI, getAssetUrl } from '../../utils/api';
import { GalleryItem } from '../../types';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminGallery = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'events' as GalleryItem['category']
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await galleryAPI.getAll();
      setImages(response.data);
    } catch (error) {
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);
    formData.append('category', uploadData.category);
    formData.append('image', imageFile);

    try {
      await galleryAPI.upload(formData);
      toast.success('Image uploaded successfully');
      setShowModal(false);
      setUploadData({ title: '', description: '', category: 'events' });
      setImageFile(null);
      fetchImages();
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await galleryAPI.delete(id);
        toast.success('Image deleted successfully');
        fetchImages();
      } catch (error) {
        toast.error('Failed to delete image');
      }
    }
  };

  const filteredImages = filterCategory === 'all' 
    ? images 
    : images.filter(img => img.category === filterCategory);

  if (loading) {
    return <div className="text-center py-8">Loading gallery...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Gallery</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
          <FaPlus /> <span>Upload Images</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <label className="block text-sm font-medium mb-2">Filter by Category</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="all">All Categories</option>
          <option value="building">Building</option>
          <option value="pastor">Pastor</option>
          <option value="events">Events</option>
          <option value="worship">Worship</option>
          <option value="youth">Youth</option>
          <option value="children">Children</option>
        </select>
        <p className="text-sm text-gray-600 mt-2">
          Showing {filteredImages.length} of {images.length} images
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <div key={image.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <img 
              src={getAssetUrl(image.imageUrl)} 
              alt={image.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold mb-1">{image.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{image.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                  {image.category}
                </span>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-600">No images found in this category</p>
        </div>
      )}
      
      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">Upload Image</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                  rows={3}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData({...uploadData, category: e.target.value as GalleryItem['category']})}
                  required
                  className="input-field"
                >
                  <option value="building">Building</option>
                  <option value="pastor">Pastor</option>
                  <option value="events">Events</option>
                  <option value="worship">Worship</option>
                  <option value="youth">Youth</option>
                  <option value="children">Children</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  required
                  className="input-field"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setUploadData({ title: '', description: '', category: 'events' });
                    setImageFile(null);
                  }}
                  className="btn-outline flex-1"
                >
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

export default AdminGallery;
