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
    <div className="page-shell">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="container-custom text-center">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-gold-200 mb-3">Faith In Frames</p>
          <h1 className="page-hero-title">Gallery</h1>
          <p className="text-xl">Moments that capture our journey of faith</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 md:py-8 surface-panel sticky top-16 md:top-20 z-40">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`chip-filter ${
                  selectedCategory === category.value
                    ? 'chip-filter-active'
                    : ''
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
            <div className="text-center py-14 md:py-20">
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
                  <div className="aspect-square overflow-hidden rounded-xl shadow-lg border border-primary-100/80">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end">
                    <div className="p-4 text-white">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-gold-200 mb-1">{item.category}</p>
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
            <div className="bg-white p-6 mt-4 rounded-xl border border-primary-100">
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
