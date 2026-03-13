import { useState } from 'react';
import { prayerRequestsAPI } from '../utils/api';
import { FaPray, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const PrayerRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'personal',
    request: '',
    isAnonymous: false,
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'personal', label: 'Personal' },
    { value: 'family', label: 'Family' },
    { value: 'health', label: 'Health' },
    { value: 'financial', label: 'Financial' },
    { value: 'spiritual', label: 'Spiritual Growth' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await prayerRequestsAPI.create({ ...formData, source: 'website' });
      if (response.data?.emailDelivered === false) {
        toast.warning(response.data?.warning || 'Your prayer request was saved, but email delivery could not be confirmed.');
      } else {
        toast.success('Your prayer request has been submitted. We will pray for you!');
      }
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: 'personal',
        request: '',
        isAnonymous: false,
      });
    } catch (error) {
      toast.error('Failed to submit prayer request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaPray className="text-6xl mx-auto mb-6" />
            <h1 className="page-hero-title">Prayer Request</h1>
            <p className="text-xl max-w-2xl mx-auto">
              We believe in the power of prayer. Share your prayer needs with us, and our prayer team will intercede on your behalf.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Prayer Request Form */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-8"
            >
              <h2 className="text-3xl font-bold mb-6">Submit Your Prayer Request</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 rounded"
                    id="anonymous"
                  />
                  <label htmlFor="anonymous" className="text-sm font-medium">
                    Submit anonymously
                  </label>
                </div>

                {!formData.isAnonymous && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required={!formData.isAnonymous}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required={!formData.isAnonymous}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Prayer Request *</label>
                  <textarea
                    name="request"
                    value={formData.request}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Share your prayer need with us..."
                    className="input-field resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Prayer Request'}
                </button>

                <p className="text-sm text-gray-600 text-center">
                  Your prayer request will be kept confidential and handled with care.
                </p>
              </form>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="card p-8 bg-primary-50">
                <FaHeart className="text-4xl text-primary-600 mb-4" />
                <h3 className="text-2xl font-bold mb-4">We're Here for You</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  At Household Of Covenant And Faith Apostolic Ministry, we believe in the power of prayer. Our dedicated prayer team commits to praying for every request submitted.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  "The prayer of a righteous person is powerful and effective." - James 5:16
                </p>
              </div>

              <div className="card p-8">
                <h3 className="text-xl font-bold mb-4">Prayer Meeting Times</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Corporate Prayer:</span>
                    <span>Friday 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Morning Prayers:</span>
                    <span>Daily 5:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Midnight Prayer:</span>
                    <span>First Friday 11:00 PM</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Join us as we pray together for breakthrough and miracles.
                </p>
              </div>

              <div className="card p-8 bg-gold-50">
                <h3 className="text-xl font-bold mb-4">Emergency Prayer Line</h3>
                <p className="text-gray-700 mb-4">
                  Need urgent prayer? Call our 24/7 prayer hotline:
                </p>
                <a
                  href="tel:+2348012345678"
                  className="text-2xl font-bold text-primary-600 hover:underline"
                >
                  +234 801 234 5678
                </a>
              </div>

              <div className="card p-8">
                <h3 className="text-xl font-bold mb-4">Testimonies</h3>
                <p className="text-gray-700 italic">
                  "I submitted a prayer request for healing, and God answered! Within weeks, the doctors confirmed I was completely healed. Thank you for your prayers!"
                </p>
                <p className="text-sm text-gray-600 mt-2">- Sister Mary J.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrayerRequest;
