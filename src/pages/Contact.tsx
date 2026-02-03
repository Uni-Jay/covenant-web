import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl">We'd love to hear from you!</p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: FaMapMarkerAlt,
                title: 'Address',
                content: '140, Obafemi Awolowo Road, Radio Bus stop, Ikorodu, Lagos Nigeria',
              },
              {
                icon: FaPhone,
                title: 'Phone',
                content: '+234 801 234 5678',
                link: 'tel:+2348012345678',
              },
              {
                icon: FaEnvelope,
                title: 'Email',
                content: 'info@wordofcovenant.org',
                link: 'mailto:info@wordofcovenant.org',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <item.icon className="text-4xl text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                {item.link ? (
                  <a href={item.link} className="text-gray-600 hover:text-primary-600">
                    {item.content}
                  </a>
                ) : (
                  <p className="text-gray-600">{item.content}</p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-8"
            >
              <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
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
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="input-field resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Map & Social */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="card overflow-hidden h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.375295315134229!3d6.515398895328511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d65b!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>

              <div className="card p-8">
                <h3 className="text-2xl font-bold mb-4">Connect With Us</h3>
                <p className="text-gray-600 mb-6">
                  Follow us on social media for updates, inspirational content, and community highlights.
                </p>
                <div className="flex space-x-4">
                  {[
                    { icon: FaFacebook, link: 'https://facebook.com', color: 'hover:text-blue-600' },
                    { icon: FaTwitter, link: 'https://twitter.com', color: 'hover:text-blue-400' },
                    { icon: FaInstagram, link: 'https://instagram.com', color: 'hover:text-pink-600' },
                    { icon: FaYoutube, link: 'https://youtube.com', color: 'hover:text-red-600' },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-600 ${social.color} transition-colors text-3xl`}
                    >
                      <social.icon />
                    </a>
                  ))}
                </div>
              </div>

              <div className="card p-8 bg-primary-50">
                <h3 className="text-xl font-bold mb-4">Service Times</h3>
                <div className="space-y-2 text-gray-700">
                  <p className="flex justify-between">
                    <span className="font-medium">Sunday School:</span>
                    <span>8:00 AM - 9:00 AM</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Sunday Service:</span>
                    <span>9:00 AM - 11:00 AM</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Prayer Hour:</span>
                    <span>Tuesday 6:00 PM - 7:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Bible Study:</span>
                    <span>Thursday 6:00 PM - 7:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Monthly Vigil:</span>
                    <span>Last Friday 11:00 PM - 4:00 AM</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
