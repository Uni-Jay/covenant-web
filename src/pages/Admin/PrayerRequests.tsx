import { useState, useEffect } from 'react';
import { prayerRequestsAPI } from '../../utils/api';
import { PrayerRequest } from '../../types';
import { toast } from 'react-toastify';

const AdminPrayerRequests = () => {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await prayerRequestsAPI.getAll();
      setRequests(response.data);
    } catch (error) {
      toast.error('Failed to load prayer requests');
    }
  };

  // const updateStatus = async (id: number, status: string) => {
  //   try {
  //     await prayerRequestsAPI.updateStatus(id, status);
  //     toast.success('Status updated');
  //     fetchRequests();
  //   } catch (error) {
  //     toast.error('Failed to update status');
  //   }
  // };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Prayer Requests</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-600 mb-4">Total Requests: {requests.length}</p>
        <p className="text-sm text-gray-500">Prayer requests management interface</p>
      </div>
    </div>
  );
};

export default AdminPrayerRequests;
