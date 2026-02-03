import { useState, useEffect } from 'react';
import { galleryAPI } from '../utils/api';
import { GalleryItem } from '../types';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'building', label: 'Church Building' },
    { value: 'pastor', label: 'Pastor & Leadership' },
    { value: 'events', label: 'Events' },
    { value: 'worship', label: 'Worship' },
    { value: 'youth', label: 'Youth Ministry' },
    { value: 'children', label: 'Children Ministry' },
  ];

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await galleryAPI.getAll();
      setGalleryItems(response.data);
    } catch (error) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = galleryItems.filter((item) =>
    selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-xl">Moments that capture our journey of faith</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white shadow-md sticky top-20 z-40">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="spinner"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl">No images found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-300">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <FaTimes />
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="bg-white p-6 mt-4 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
              <p className="text-gray-600">{selectedImage.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Uploaded: {new Date(selectedImage.uploadDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
