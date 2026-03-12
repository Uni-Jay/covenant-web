import { useState, useEffect } from 'react';
import { membersAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaUserTag } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  profile_image?: string;
  departments?: string;
}

const AdminMembers = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMembers(members);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = members.filter(
        (member) =>
          member.first_name.toLowerCase().includes(query) ||
          member.last_name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query)
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await membersAPI.getAll();
      setMembers(response.data.users || []);
      setFilteredMembers(response.data.users || []);
    } catch (error: any) {
      toast.error('Failed to load members');
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800',
      media_head: 'bg-blue-100 text-blue-800',
      media: 'bg-cyan-100 text-cyan-800',
      pastor: 'bg-yellow-100 text-yellow-800',
      elder: 'bg-orange-100 text-orange-800',
      deacon: 'bg-green-100 text-green-800',
      member: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold">Manage Members</h1>
          <p className="text-gray-600 mt-2">Total Members: {filteredMembers.length}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {member.profile_image ? (
                  <img
                    src={member.profile_image}
                    alt={`${member.first_name} ${member.last_name}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    {member.first_name[0]}{member.last_name[0]}
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {member.first_name} {member.last_name}
                </h3>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaEnvelope className="mr-2 text-gray-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  
                  {member.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FaPhone className="mr-2 text-gray-400" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>

                {/* Role Badge */}
                <div className="mt-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                    <FaUserTag className="mr-1" />
                    {member.role.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <FaUser className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No members found</p>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
