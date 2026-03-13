import { useState, useEffect } from 'react';
import { eventsAPI, getAssetUrl } from '../utils/api';
import { Event } from '../types';
import { FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfSeats: 1
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    
    if (filter === 'upcoming') {
      return eventDate >= now;
    } else if (filter === 'past') {
      return eventDate < now;
    }
    return true;
  });

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await eventsAPI.register(selectedEvent!.id, registrationData);
      if (response.data?.emailDelivered === false) {
        toast.warning('Registration was saved, but email delivery could not be confirmed.');
      } else {
        toast.success(`Successfully registered for ${selectedEvent?.title}!`);
      }
      setShowRegistrationModal(false);
      setRegistrationData({ name: '', email: '', phone: '', numberOfSeats: 1 });
      setSelectedEvent(null);
    } catch (error) {
      toast.error('Failed to register for event');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="container-custom text-center">
          <h1 className="page-hero-title">Events</h1>
          <p className="text-xl">Join us for inspiring gatherings and fellowship</p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white shadow-md">
        <div className="container-custom">
          <div className="flex justify-center space-x-4">
            {(['all', 'upcoming', 'past'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  filter === tab
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="spinner"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-14 md:py-20">
              <p className="text-gray-600 text-xl">No events found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => {
                const imageUrl = event.imageUrl ? getAssetUrl(event.imageUrl) : 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400';
                return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card overflow-hidden"
                >
                  <img
                    src={imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <span className="text-xs bg-primary-100 text-primary-600 px-3 py-1 rounded-full">
                      {event.category}
                    </span>
                    <h3 className="text-xl font-bold mt-3 mb-3">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <FaCalendar className="text-primary-600" />
                        <span>{format(parseISO(event.date), 'MMMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaClock className="text-primary-600" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-primary-600" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRegisterClick(event)}
                      className="w-full mt-6 btn-primary"
                    >
                      Register Now
                    </button>
                  </div>
                </motion.div>
              );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistrationModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-8 my-8 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4">Register for Event</h2>
            <h3 className="text-lg text-primary-600 mb-6">{selectedEvent.title}</h3>
            
            <form onSubmit={handleRegistrationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                  required
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                  required
                  className="input-field"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                  required
                  className="input-field"
                  placeholder="+234 800 000 0000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Number of Seats</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={registrationData.numberOfSeats}
                  onChange={(e) => setRegistrationData({...registrationData, numberOfSeats: parseInt(e.target.value)})}
                  className="input-field"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Event Details:</p>
                <p className="text-sm"><strong>Date:</strong> {format(parseISO(selectedEvent.date), 'MMMM dd, yyyy')}</p>
                <p className="text-sm"><strong>Time:</strong> {selectedEvent.time}</p>
                <p className="text-sm"><strong>Location:</strong> {selectedEvent.location}</p>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Confirm Registration
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRegistrationModal(false);
                    setSelectedEvent(null);
                    setRegistrationData({ name: '', email: '', phone: '', numberOfSeats: 1 });
                  }}
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

export default Events;
