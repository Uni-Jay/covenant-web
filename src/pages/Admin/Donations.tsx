import { useState, useEffect } from 'react';
import { donationsAPI } from '../../utils/api';
import { Donation } from '../../types';
import { toast } from 'react-toastify';
import { FaHeart } from 'react-icons/fa';

const AdminDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await donationsAPI.getAll();
      setDonations(response.data);
      const sum = response.data.reduce((acc: number, d: Donation) => acc + d.amount, 0);
      setTotal(sum);
    } catch (error) {
      toast.error('Failed to load donations');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Donations</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <FaHeart className="text-4xl text-red-500 mb-4" />
          <h3 className="text-3xl font-bold">₦{(total / 1000).toFixed(0)}K</h3>
          <p className="text-gray-600">Total Donations</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-3xl font-bold">{donations.length}</h3>
          <p className="text-gray-600">Total Transactions</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-3xl font-bold">₦{total > 0 ? (total / donations.length / 1000).toFixed(1) : 0}K</h3>
          <p className="text-gray-600">Average Donation</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-600">Donations management interface</p>
      </div>
    </div>
  );
};

export default AdminDonations;
