import { FaBook, FaDownload, FaCalendar, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { contentAPI } from '../utils/api';


const BibleStudy = () => {
  const [loading, setLoading] = useState(true);
  const [weeklyStudy, setWeeklyStudy] = useState<any>(null);
  const [studies, setStudies] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showJoinWeekModal, setShowJoinWeekModal] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<any>(null);
  const [enrollData, setEnrollData] = useState({
    name: '',
    email: '',
    phone: '',
    studyTitle: ''
  });
  const [joinWeekData, setJoinWeekData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await contentAPI.getBibleStudy();
        setWeeklyStudy(response.data.weeklyStudy);
        setStudies(response.data.studies || []);
        setResources(response.data.resources || []);
      } catch (error) {
        toast.error('Failed to load Bible Study content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleJoinWeek = () => {
    setShowJoinWeekModal(true);
  };

  const handleJoinWeekSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contentAPI.joinBibleStudyWeek(joinWeekData);
      toast.success("Successfully registered for this week's Bible Study! We'll send you the Zoom link.");
      setShowJoinWeekModal(false);
      setJoinWeekData({ name: '', email: '', phone: '' });
    } catch (error) {
      toast.error('Failed to submit Bible Study registration');
    }
  };

  const handleEnroll = (study: any) => {
    setSelectedStudy(study);
    setEnrollData({ ...enrollData, studyTitle: study.title });
    setShowEnrollModal(true);
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contentAPI.enrollBibleStudy(enrollData);
      toast.success(`Successfully enrolled in ${selectedStudy?.title}! We'll contact you soon.`);
      setShowEnrollModal(false);
      setEnrollData({ name: '', email: '', phone: '', studyTitle: '' });
    } catch (error) {
      toast.error('Failed to submit Bible Study enrollment');
    }
  };

  const handleDownload = (resource: any) => {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
    toast.success(`Opening ${resource.title}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <FaBook className="text-6xl mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Bible Study</h1>
          <p className="text-xl">Grow deeper in your knowledge of God's Word</p>
        </div>
      </section>

      {/* Bible Study Schedule */}
      <section className="py-12">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center items-center h-64"><div className="spinner"></div></div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-8 mb-12 bg-primary-50"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Weekly Bible Study</h2>
                    <p className="text-gray-700 text-lg mb-4">
                      Join us every Wednesday as we study God's Word together, ask questions, and grow in faith.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <FaCalendar className="text-primary-600" />
                        <span className="font-semibold">{weeklyStudy?.time}</span>
                      </div>
                      <p className="text-gray-600 ml-8">Location: {weeklyStudy?.location}</p>
                      <p className="text-gray-600 ml-8">Also available via Zoom</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-3">This Week's Topic</h3>
                    <p className="text-2xl font-bold text-primary-600 mb-2">
                      "{weeklyStudy?.title}"
                    </p>
                    <p className="text-gray-600 mb-4">{weeklyStudy?.scripture}</p>
                    <button 
                      onClick={handleJoinWeek}
                      className="btn-primary"
                    >
                      Join This Week
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Current Studies */}
              <h2 className="section-title text-center mb-12">Current Study Series</h2>
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {studies.map((study, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card p-6"
                  >
                    <h3 className="text-xl font-bold mb-3">{study.title}</h3>
                    <p className="text-gray-600 mb-4">{study.description}</p>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">Duration:</span> {study.duration}
                      </p>
                      <p>
                        <span className="font-semibold">Level:</span>{' '}
                        <span
                          className={`px-2 py-1 rounded ${
                            study.level === 'Beginner'
                              ? 'bg-green-100 text-green-700'
                              : study.level === 'Intermediate'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {study.level}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleEnroll(study)}
                      className="w-full mt-4 btn-outline"
                    >
                      Enroll Now
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Resources */}
              <div className="card p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Study Resources</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FaDownload className="text-primary-600 text-2xl" />
                        <div>
                          <p className="font-semibold">{resource.title}</p>
                          <p className="text-sm text-gray-600">
                            {resource.type} • {resource.size}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(resource)}
                        className="btn-primary py-2"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Enrollment Modal */}
      {showEnrollModal && selectedStudy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-8 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">Enroll in Study</h2>
                <h3 className="text-lg text-primary-600 mt-1">{selectedStudy.title}</h3>
              </div>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={enrollData.name}
                  onChange={(e) => setEnrollData({...enrollData, name: e.target.value})}
                  required
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  value={enrollData.email}
                  onChange={(e) => setEnrollData({...enrollData, email: e.target.value})}
                  required
                  className="input-field"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={enrollData.phone}
                  onChange={(e) => setEnrollData({...enrollData, phone: e.target.value})}
                  required
                  className="input-field"
                  placeholder="+234 800 000 0000"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Study Details:</p>
                <p className="text-sm"><strong>Duration:</strong> {selectedStudy.duration}</p>
                <p className="text-sm"><strong>Level:</strong> {selectedStudy.level}</p>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Confirm Enrollment
                </button>
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Join This Week Modal */}
      {showJoinWeekModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-8 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">Join This Week's Study</h2>
                <h3 className="text-lg text-primary-600 mt-1">Walking in the Light</h3>
              </div>
              <button
                onClick={() => setShowJoinWeekModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            <form onSubmit={handleJoinWeekSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={joinWeekData.name}
                  onChange={(e) => setJoinWeekData({...joinWeekData, name: e.target.value})}
                  required
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  value={joinWeekData.email}
                  onChange={(e) => setJoinWeekData({...joinWeekData, email: e.target.value})}
                  required
                  className="input-field"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={joinWeekData.phone}
                  onChange={(e) => setJoinWeekData({...joinWeekData, phone: e.target.value})}
                  required
                  className="input-field"
                  placeholder="+234 800 000 0000"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Study Details:</p>
                <p className="text-sm"><strong>Topic:</strong> {weeklyStudy?.title}</p>
                <p className="text-sm"><strong>Scripture:</strong> {weeklyStudy?.scripture}</p>
                <p className="text-sm"><strong>Time:</strong> {weeklyStudy?.time}</p>
                <p className="text-sm"><strong>Location:</strong> {weeklyStudy?.location}</p>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Confirm Registration
                </button>
                <button
                  type="button"
                  onClick={() => setShowJoinWeekModal(false)}
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

export default BibleStudy;
