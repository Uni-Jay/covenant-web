import { useState, useEffect } from 'react';
import { getAssetUrl, ministriesAPI } from '../utils/api';
import { Ministry } from '../types';
import { FaUsers, FaClock, FaUser, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Ministries = () => {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState<any>(null);
  const [joinData, setJoinData] = useState({
    name: '',
    email: '',
    phone: '',
    ministryName: ''
  });

  const handleJoinMinistry = (ministry: any) => {
    setSelectedMinistry(ministry);
    setJoinData({ ...joinData, ministryName: ministry.name });
    setShowJoinModal(true);
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await ministriesAPI.join(selectedMinistry.id, joinData);
      if (response.data?.emailDelivered === false) {
        toast.warning('Join request saved, but email delivery could not be confirmed.');
      } else {
        toast.success(`Successfully submitted request to join ${selectedMinistry?.name}! We'll contact you soon.`);
      }
      setShowJoinModal(false);
      setJoinData({ name: '', email: '', phone: '', ministryName: '' });
    } catch (error) {
      toast.error('Failed to submit ministry join request');
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    try {
      const response = await ministriesAPI.getAll();
      setMinistries(response.data);
    } catch (error) {
      toast.error('Failed to load ministries');
    } finally {
      setLoading(false);
    }
  };

  const displayMinistries = Array.from(
    new Map(ministries.map((m: any) => [m.name.toLowerCase(), m])).values()
  );

  return (
    <div className="page-shell">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="container-custom text-center">
          <h1 className="page-hero-title">Our Ministries</h1>
          <p className="text-xl">Find your place to serve and grow</p>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="py-12">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="spinner"></div>
            </div>
          ) : displayMinistries.length === 0 ? (
            <div className="text-center py-14 md:py-20 text-gray-600 text-xl">No ministries available right now.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayMinistries.map((ministry, index) => (
                <motion.div
                  key={ministry.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card group border border-primary-100/80"
                >
                  <div className="overflow-hidden">
                    <img
                      src={ministry.imageUrl ? getAssetUrl(ministry.imageUrl) : 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400'}
                      alt={ministry.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-600 transition-colors">
                      {ministry.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{ministry.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <FaUser className="text-primary-600" />
                        <span>{ministry.leader}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <FaClock className="text-primary-600" />
                        <span>{ministry.schedule}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinMinistry(ministry)}
                      className="w-full mt-6 btn-outline"
                    >
                      Join Ministry
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-b from-primary-50/80 to-white/80">
        <div className="container-custom text-center">
          <FaUsers className="text-6xl text-primary-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4 text-primary-900">Find Your Ministry</h2>
          <p className="text-xl text-primary-800 mb-8 max-w-2xl mx-auto">
            God has equipped you with unique gifts and talents. Use them to serve in one of our ministries and make an eternal impact!
          </p>
          <a href="mailto:info@hocfam.org" className="btn-primary">
            Get Involved Today
          </a>
        </div>
      </section>

      {/* Join Ministry Modal */}
      {showJoinModal && selectedMinistry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-8 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">Join Ministry</h2>
                <h3 className="text-lg text-primary-600 mt-1">{selectedMinistry.name}</h3>
              </div>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={joinData.name}
                  onChange={(e) => setJoinData({...joinData, name: e.target.value})}
                  required
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  value={joinData.email}
                  onChange={(e) => setJoinData({...joinData, email: e.target.value})}
                  required
                  className="input-field"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={joinData.phone}
                  onChange={(e) => setJoinData({...joinData, phone: e.target.value})}
                  required
                  className="input-field"
                  placeholder="+234 800 000 0000"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Ministry Details:</p>
                <p className="text-sm"><strong>Leader:</strong> {selectedMinistry.leader}</p>
                <p className="text-sm"><strong>Schedule:</strong> {selectedMinistry.schedule}</p>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Ministries;
