import { useState, useEffect } from 'react';
import { eventsAPI } from '../../utils/api';
import { Event } from '../../types';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Event>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(currentEvent).forEach(key => {
      if (currentEvent[key as keyof Event] && key !== 'id') {
        formData.append(key, currentEvent[key as keyof Event] as string);
      }
    });

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (currentEvent.id) {
        await eventsAPI.update(currentEvent.id, formData);
        toast.success('Event updated successfully');
      } else {
        await eventsAPI.create(formData);
        toast.success('Event created successfully');
      }
      setShowModal(false);
      setCurrentEvent({});
      setImageFile(null);
      fetchEvents();
    } catch (error) {
      toast.error('Failed to save event');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.delete(id);
        toast.success('Event deleted successfully');
        fetchEvents();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <button 
          onClick={() => {
            setCurrentEvent({});
            setImageFile(null);
            setShowModal(true);
          }} 
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus /> <span>Add Event</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Time</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t">
                <td className="px-6 py-4">{event.title}</td>
                <td className="px-6 py-4">{new Date(event.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{event.time}</td>
                <td className="px-6 py-4">{event.location}</td>
                <td className="px-6 py-4">{event.category}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setCurrentEvent(event);
                        setShowModal(true);
                      }}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">
              {currentEvent.id ? 'Edit Event' : 'Add New Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={currentEvent.title || ''}
                  onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})}
                  required
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    value={currentEvent.date || ''}
                    onChange={(e) => setCurrentEvent({...currentEvent, date: e.target.value})}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time *</label>
                  <input
                    type="time"
                    value={currentEvent.time || ''}
                    onChange={(e) => setCurrentEvent({...currentEvent, time: e.target.value})}
                    required
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <input
                  type="text"
                  value={currentEvent.location || ''}
                  onChange={(e) => setCurrentEvent({...currentEvent, location: e.target.value})}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={currentEvent.category || ''}
                  onChange={(e) => setCurrentEvent({...currentEvent, category: e.target.value})}
                  required
                  className="input-field"
                >
                  <option value="">Select Category</option>
                  <option value="Service">Service</option>
                  <option value="Conference">Conference</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Outreach">Outreach</option>
                  <option value="Fellowship">Fellowship</option>
                  <option value="Special">Special</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={currentEvent.description || ''}
                  onChange={(e) => setCurrentEvent({...currentEvent, description: e.target.value})}
                  rows={4}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Event Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="input-field"
                />
                {currentEvent.imageUrl && (
                  <p className="text-sm text-gray-500 mt-1">Current image: {currentEvent.imageUrl}</p>
                )}
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {currentEvent.id ? 'Update' : 'Create'} Event
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setCurrentEvent({});
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

export default AdminEvents;
