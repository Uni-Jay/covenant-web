import { useState, useEffect } from 'react';
import { getAssetUrl, sermonsAPI } from '../utils/api';
import { Sermon } from '../types';
import { FaPlay, FaHeadphones, FaFilePdf, FaEye, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import { toast } from 'react-toastify';

const Sermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);

  const categories = ['all', 'Sunday Service', 'Bible Study', 'Special', 'Conference'];

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const response = await sermonsAPI.getAll();
      console.log('Fetched sermons:', response.data);
      console.log('Total sermons count:', response.data?.length || 0);
      setSermons(response.data);
    } catch (error) {
      console.error('Error fetching sermons:', error);
      toast.error('Failed to load sermons');
    } finally {
      setLoading(false);
    }
  };

  const filteredSermons = sermons.filter((sermon) => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.preacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sermon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-4">Sermons</h1>
          <p className="text-xl">
            Listen to inspiring messages that transform lives
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white shadow-md sticky top-20 z-40">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sermons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Category Filter and Refresh Button */}
            <div className="flex gap-2 items-center">
              <button
                onClick={fetchSermons}
                className="px-4 py-2 bg-secondary-600 text-white rounded-lg font-medium hover:bg-secondary-700 transition-colors flex items-center gap-2"
                title="Refresh sermons list"
              >
                <span>🔄</span>
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sermon count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredSermons.length} of {sermons.length} sermon{sermons.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Sermons Grid */}
      <section className="py-12">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="spinner"></div>
            </div>
          ) : filteredSermons.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl">No sermons found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSermons.map((sermon, index) => (
                <motion.div
                  key={sermon.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card cursor-pointer"
                  onClick={() => setSelectedSermon(sermon)}
                >
                  <div className="relative">
                    <img
                      src={sermon.thumbnailUrl ? getAssetUrl(sermon.thumbnailUrl) : 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400'}
                      alt={sermon.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <FaPlay className="text-white text-4xl" />
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-xs bg-primary-100 text-primary-600 px-3 py-1 rounded-full">
                      {sermon.category}
                    </span>
                    <h3 className="text-xl font-bold mt-3 mb-2">{sermon.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {sermon.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{sermon.preacher}</span>
                      <span>{new Date(sermon.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaEye />
                        <span className="text-sm">{sermon.views} views</span>
                      </div>
                      <div className="flex space-x-2">
                        {sermon.videoUrl && <FaPlay className="text-primary-600" />}
                        {sermon.audioUrl && <FaHeadphones className="text-primary-600" />}
                        {sermon.pdfUrl && <FaFilePdf className="text-primary-600" />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sermon Modal */}
      {selectedSermon && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedSermon.title}</h2>
              <button
                onClick={() => setSelectedSermon(null)}
                className="text-gray-600 hover:text-gray-900 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {selectedSermon.videoUrl && (
                <div className="mb-6">
                  <ReactPlayer
                    url={getAssetUrl(selectedSermon.videoUrl)}
                    width="100%"
                    height="400px"
                    controls
                  />
                </div>
              )}
              <p className="text-gray-600 mb-4">{selectedSermon.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Preacher</p>
                  <p className="font-semibold">{selectedSermon.preacher}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">
                    {new Date(selectedSermon.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                {selectedSermon.audioUrl && (
                  <a
                    href={getAssetUrl(selectedSermon.audioUrl)}
                      download={`${selectedSermon.title} - ${selectedSermon.preacher}${selectedSermon.audioUrl.substring(selectedSermon.audioUrl.lastIndexOf('.'))}`}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FaHeadphones />
                    <span>Download Audio</span>
                  </a>
                )}
                {selectedSermon.pdfUrl && (
                  <a
                    href={getAssetUrl(selectedSermon.pdfUrl)}
                      download={`${selectedSermon.title} - ${selectedSermon.preacher}.pdf`}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <FaFilePdf />
                    <span>Download PDF</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sermons;
