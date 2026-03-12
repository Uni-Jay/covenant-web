import { useState, useEffect } from 'react';
import { prayerRequestsAPI } from '../../utils/api';
import { PrayerRequest } from '../../types';
import { toast } from 'react-toastify';
import { FaPray, FaEnvelope, FaPhone, FaCheckCircle, FaClock, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminPrayerRequests = () => {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await prayerRequestsAPI.getAll();
      // Server returns { requests: [...] }
      const prayerData = response.data.requests || [];
      setRequests(prayerData);
    } catch (error: any) {
      console.error('Failed to load prayer requests:', error);
      toast.error('Failed to load prayer requests');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await prayerRequestsAPI.updateStatus(id, status);
      toast.success('Status updated successfully');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(req => req.status === filter);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      prayed: 'bg-blue-100 text-blue-800',
      open: 'bg-yellow-100 text-yellow-800',
      ongoing: 'bg-blue-100 text-blue-800',
      answered: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'answered') return <FaCheckCircle className="text-green-600" />;
    if (status === 'prayed' || status === 'ongoing') return <FaHeart className="text-blue-600" />;
    return <FaClock className="text-yellow-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <FaPray className="mr-3 text-blue-600" />
            Prayer Requests
          </h1>
          <p className="text-gray-600 mt-2">Total Requests: {requests.length}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({requests.length})
        </button>
        <button
          onClick={() => setFilter('open')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'open' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Open ({requests.filter(r => r.status === 'open' || r.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('ongoing')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'ongoing' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Praying ({requests.filter(r => r.status === 'ongoing' || r.status === 'prayed').length})
        </button>
        <button
          onClick={() => setFilter('answered')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'answered' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Answered ({requests.filter(r => r.status === 'answered').length})
        </button>
      </div>

      {/* Prayer Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FaPray className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No prayer requests found</p>
          </div>
        ) : (
          filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(request.status)}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  {request.category && (
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium mb-3">
                      {request.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-800 text-base leading-relaxed">{request.request}</p>
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  {request.name && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Name:</span> {request.name}
                    </div>
                  )}
                  {request.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FaEnvelope className="mr-2 text-gray-400" />
                      {request.email}
                    </div>
                  )}
                  {request.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FaPhone className="mr-2 text-gray-400" />
                      {request.phone}
                    </div>
                  )}
                </div>

                {/* Status Update Buttons */}
                <div className="flex gap-2">
                  {request.status !== 'ongoing' && request.status !== 'prayed' && (
                    <button
                      onClick={() => updateStatus(request.id, 'ongoing')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Mark as Praying
                    </button>
                  )}
                  {request.status !== 'answered' && (
                    <button
                      onClick={() => updateStatus(request.id, 'answered')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Mark as Answered
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPrayerRequests;
