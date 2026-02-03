import { useState, useEffect } from 'react';
import { sermonsAPI } from '../../utils/api';
import { Sermon } from '../../types';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminSermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSermon, setCurrentSermon] = useState<Partial<Sermon>>({});
  const [files, setFiles] = useState<{video?: File; audio?: File; pdf?: File; thumbnail?: File}>({});

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const response = await sermonsAPI.getAll();
      setSermons(response.data);
    } catch (error) {
      toast.error('Failed to load sermons');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(currentSermon).forEach(key => {
      if (currentSermon[key as keyof Sermon]) {
        formData.append(key, currentSermon[key as keyof Sermon] as string);
      }
    });

    Object.keys(files).forEach(key => {
      const file = files[key as keyof typeof files];
      if (file) formData.append(key, file);
    });

    try {
      if (currentSermon.id) {
        await sermonsAPI.update(currentSermon.id, formData);
        toast.success('Sermon updated successfully');
      } else {
        await sermonsAPI.create(formData);
        toast.success('Sermon created successfully');
      }
      setShowModal(false);
      fetchSermons();
    } catch (error) {
      toast.error('Failed to save sermon');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this sermon?')) {
      try {
        await sermonsAPI.delete(id);
        toast.success('Sermon deleted successfully');
        fetchSermons();
      } catch (error) {
        toast.error('Failed to delete sermon');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Sermons</h1>
        <button
          onClick={() => {
            setCurrentSermon({});
            setFiles({});
            setShowModal(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Sermon</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Preacher</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Views</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sermons.map((sermon) => (
              <tr key={sermon.id} className="border-t">
                <td className="px-6 py-4">{sermon.title}</td>
                <td className="px-6 py-4">{sermon.preacher}</td>
                <td className="px-6 py-4">{new Date(sermon.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{sermon.category}</td>
                <td className="px-6 py-4">{sermon.views}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setCurrentSermon(sermon);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(sermon.id)}
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
              {currentSermon.id ? 'Edit Sermon' : 'Add New Sermon'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={currentSermon.title || ''}
                  onChange={(e) => setCurrentSermon({...currentSermon, title: e.target.value})}
                  required
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preacher *</label>
                  <input
                    type="text"
                    value={currentSermon.preacher || ''}
                    onChange={(e) => setCurrentSermon({...currentSermon, preacher: e.target.value})}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    value={currentSermon.date || ''}
                    onChange={(e) => setCurrentSermon({...currentSermon, date: e.target.value})}
                    required
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={currentSermon.category || ''}
                  onChange={(e) => setCurrentSermon({...currentSermon, category: e.target.value})}
                  required
                  className="input-field"
                >
                  <option value="">Select Category</option>
                  <option value="Sunday Service">Sunday Service</option>
                  <option value="Bible Study">Bible Study</option>
                  <option value="Special">Special</option>
                  <option value="Conference">Conference</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={currentSermon.description || ''}
                  onChange={(e) => setCurrentSermon({...currentSermon, description: e.target.value})}
                  rows={4}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Video File</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFiles({...files, video: e.target.files?.[0]})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Audio File</label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setFiles({...files, audio: e.target.files?.[0]})}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">PDF File</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFiles({...files, pdf: e.target.files?.[0]})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFiles({...files, thumbnail: e.target.files?.[0]})}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {currentSermon.id ? 'Update' : 'Create'} Sermon
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

export default AdminSermons;
