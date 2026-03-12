import { useState, useEffect } from 'react';
import { ministriesAPI } from '../utils/api';
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
    toast.success(`Successfully submitted request to join ${selectedMinistry?.name}! We'll contact you soon.`);
    setShowJoinModal(false);
    setJoinData({ name: '', email: '', phone: '', ministryName: '' });
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

  // Default ministries if none from API
  const defaultMinistries = [
    {
      id: 1,
      name: 'Children Ministry',
      description: 'Nurturing young hearts to know and love Jesus. Age-appropriate lessons, activities, and fun!',
      leader: 'Sister Grace Ade',
      imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
      schedule: 'Sunday 9:00 AM',
    },
    {
      id: 2,
      name: 'Youth Ministry',
      description: 'Empowering young people to live boldly for Christ in today\'s world.',
      leader: 'Pastor David Okon',
      imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400',
      schedule: 'Saturday 4:00 PM',
    },
    {
      id: 3,
      name: 'Women Ministry',
      description: 'Building godly women of faith, purpose, and strength.',
      leader: 'Sis. Sarah Johnson',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      schedule: 'First Saturday 10:00 AM',
    },
    {
      id: 4,
      name: 'Men Ministry',
      description: 'Equipping men to be spiritual leaders in their homes and communities.',
      leader: 'Elder Michael Brown',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      schedule: 'Second Saturday 2:00 PM',
    },
    {
      id: 5,
      name: 'Choir & Music',
      description: 'Using our voices and instruments to worship God and inspire others.',
      leader: 'Minister Emmanuel Nwankwo',
      imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
      schedule: 'Thursday 6:00 PM (Rehearsal)',
    },
    {
      id: 6,
      name: 'Drama Ministry',
      description: 'Bringing biblical stories and messages to life through creative theatrical performances and skits.',
      leader: 'Bro. David Adebayo',
      imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400',
      schedule: 'Wednesday 5:00 PM',
    },
    {
      id: 7,
      name: 'Media Department',
      description: 'Broadcasting the Gospel through technology. Responsible for live streaming, recordings, and digital content.',
      leader: 'Bro. James Okafor',
      imageUrl: 'https://images.unsplash.com/photo-1492724724894-7464c27d0ceb?w=400',
      schedule: 'All Services',
    },
    {
      id: 8,
      name: 'Ushering',
      description: 'Welcoming and serving with excellence, making everyone feel at home.',
      leader: 'Sis. Blessing Adeyemi',
      imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400',
      schedule: 'All Services',
    },
    {
      id: 9,
      name: 'Evangelism',
      description: 'Reaching the lost with the Gospel of Jesus Christ through outreach and soul winning.',
      leader: 'Pastor Daniel Okeke',
      imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400',
      schedule: 'Saturday 3:00 PM',
    },
  ];

  // Remove duplicates based on ministry name and use ministries from API if available
  const allMinistries = ministries.length > 0 ? ministries : defaultMinistries;
  const uniqueMinistries = Array.from(
    new Map(allMinistries.map((m: any) => [m.name.toLowerCase(), m])).values()
  );
  const displayMinistries = uniqueMinistries;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-4">Our Ministries</h1>
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
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayMinistries.map((ministry, index) => (
                <motion.div
                  key={ministry.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card group"
                >
                  <div className="overflow-hidden">
                    <img
                      src={ministry.imageUrl}
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
      <section className="py-20 bg-primary-50">
        <div className="container-custom text-center">
          <FaUsers className="text-6xl text-primary-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Find Your Ministry</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
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
