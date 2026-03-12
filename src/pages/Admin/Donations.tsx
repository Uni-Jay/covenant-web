import { useState, useEffect } from 'react';
import { donationsAPI } from '../../utils/api';
import { Donation } from '../../types';
import { toast } from 'react-toastify';
import { FaHeart, FaCheckCircle, FaTimesCircle, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await donationsAPI.getAll();
      // Server returns { donations: [...] }
      const donationData = response.data.donations || [];
      setDonations(donationData);
    } catch (error: any) {
      console.error('Failed to load donations:', error);
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = filter === 'all'
    ? donations
    : donations.filter(d => d.status === filter);

  const approvedDonations = donations.filter(d => d.status === 'completed' || d.status === 'approved');
  const declinedDonations = donations.filter(d => d.status === 'declined' || d.status === 'rejected');
  
  const approvedTotal = approvedDonations.reduce((acc, d) => acc + Number(d.amount || 0), 0);
  const declinedTotal = declinedDonations.reduce((acc, d) => acc + Number(d.amount || 0), 0);
  const totalDonations = donations.reduce((acc, d) => acc + Number(d.amount || 0), 0);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      completed: 'bg-green-100 text-green-800',
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      declined: 'bg-red-100 text-red-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed' || status === 'approved') return <FaCheckCircle className="text-green-600" />;
    if (status === 'declined' || status === 'rejected') return <FaTimesCircle className="text-red-600" />;
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
            <FaHeart className="mr-3 text-red-500" />
            Donations
          </h1>
          <p className="text-gray-600 mt-2">From All Members</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white"
        >
          <FaMoneyBillWave className="text-4xl mb-4 opacity-80" />
          <h3 className="text-3xl font-bold">₦{(totalDonations / 1000).toFixed(1)}K</h3>
          <p className="opacity-90">Total Donations</p>
          <p className="text-xs opacity-75 mt-1">All statuses combined</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white"
        >
          <FaCheckCircle className="text-4xl mb-4 opacity-80" />
          <h3 className="text-3xl font-bold">₦{(approvedTotal / 1000).toFixed(1)}K</h3>
          <p className="opacity-90">Approved</p>
          <p className="text-xs opacity-75 mt-1">{approvedDonations.length} transactions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-6 text-white"
        >
          <FaTimesCircle className="text-4xl mb-4 opacity-80" />
          <h3 className="text-3xl font-bold">₦{(declinedTotal / 1000).toFixed(1)}K</h3>
          <p className="opacity-90">Declined</p>
          <p className="text-xs opacity-75 mt-1">{declinedDonations.length} transactions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-3xl font-bold text-gray-900">
            ₦{approvedDonations.length > 0 ? (approvedTotal / approvedDonations.length / 1000).toFixed(1) : 0}K
          </h3>
          <p className="text-gray-600">Average Donation</p>
          <p className="text-xs text-gray-500 mt-1">Based on approved</p>
        </motion.div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({donations.length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Approved ({donations.filter(d => d.status === 'completed' || d.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending ({donations.filter(d => d.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('declined')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'declined' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Declined ({donations.filter(d => d.status === 'declined' || d.status === 'rejected').length})
        </button>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredDonations.length === 0 ? (
          <div className="p-12 text-center">
            <FaHeart className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No donations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDonations.map((donation: any) => (
                  <motion.tr
                    key={donation.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{donation.name}</div>
                      <div className="text-sm text-gray-500">{donation.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">₦{Number(donation.amount || 0).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{donation.purpose || donation.donation_type || 'General'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{donation.paymentMethod || donation.payment_method || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(donation.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                          {donation.status.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(donation.createdAt || donation.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDonations;
