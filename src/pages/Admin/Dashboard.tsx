import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaBook, FaCalendar, FaPray, FaHeart, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { dashboardAPI, sermonsAPI, eventsAPI } from '../../utils/api';

interface Sermon {
  id: number;
  title: string;
  preacher: string;
  date: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalSermons: 0,
    upcomingEvents: 0,
    prayerRequests: 0,
    donations: 0,
  });
  const [recentSermons, setRecentSermons] = useState<Sermon[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [dashboardStatsRes, sermonsRes, eventsRes] = await Promise.all([
        dashboardAPI.getStats(),
        sermonsAPI.getAll(),
        eventsAPI.getAll(),
      ]);

      // Extract data from axios responses
      const dashStats = dashboardStatsRes.data;
      const sermons = sermonsRes.data;
      const events = eventsRes.data;

      // Get upcoming events (future dates only)
      const today = new Date();
      const upcomingEventsCount = events.filter((event: Event) => new Date(event.date) >= today).length;

      setStats({
        totalMembers: dashStats.members?.total || 0,
        totalSermons: sermons.length,
        upcomingEvents: upcomingEventsCount,
        prayerRequests: dashStats.prayers?.active || 0,
        donations: dashStats.donations?.totalThisMonth || 0,
      });

      // Get recent sermons (last 3)
      setRecentSermons(sermons.slice(0, 3));

      // Get upcoming events (next 3)
      const upcoming = events
        .filter((event: Event) => new Date(event.date) >= today)
        .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);
      setUpcomingEvents(upcoming);

    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers.toLocaleString(),
      icon: FaUsers,
      color: 'bg-primary-600',
      change: '+12%',
      isPositive: true,
    },
    {
      title: 'Sermons',
      value: stats.totalSermons,
      icon: FaBook,
      color: 'bg-primary-500',
      change: `+${stats.totalSermons}`,
      isPositive: true,
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: FaCalendar,
      color: 'bg-accent-600',
      change: `${stats.upcomingEvents}`,
      isPositive: true,
    },
    {
      title: 'Prayer Requests',
      value: stats.prayerRequests,
      icon: FaPray,
      color: 'bg-accent-500',
      change: `+${stats.prayerRequests}`,
      isPositive: true,
    },
    {
      title: 'Total Donations This Month',
      value: `₦${(stats.donations / 1000).toFixed(0)}K`,
      icon: FaHeart,
      color: 'bg-primary-700',
      change: 'All statuses',
      isPositive: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-primary-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-primary-600 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg shadow-md`}>
                <stat.icon className="text-white text-2xl" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.isPositive ? <FaArrowUp /> : <FaArrowDown />}
                <span className="font-semibold">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1 text-gray-900">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <h2 className="text-xl font-bold mb-4 text-primary-900 flex items-center">
            <FaBook className="mr-2 text-blue-600" />
            Recent Sermons
          </h2>
          <div className="space-y-4">
            {recentSermons.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No sermons available</p>
            ) : (
              recentSermons.map((sermon) => (
                <div key={sermon.id} className="flex items-center space-x-4 pb-4 border-b last:border-0 hover:bg-primary-50 p-2 rounded-lg transition-colors">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FaBook className="text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{sermon.title}</h3>
                    <p className="text-sm text-gray-600">
                      {sermon.preacher} • {new Date(sermon.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
          <h2 className="text-xl font-bold mb-4 text-primary-900 flex items-center">
            <FaCalendar className="mr-2 text-red-600" />
            Upcoming Events
          </h2>
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming events</p>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-4 pb-4 border-b last:border-0 hover:bg-red-50 p-2 rounded-lg transition-colors">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FaCalendar className="text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()} • {event.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-white">Quick Actions</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/admin/sermons')}
            className="bg-white hover:bg-blue-50 text-blue-700 font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaBook className="inline-block mr-2" />
            Add New Sermon
          </button>
          <button 
            onClick={() => navigate('/admin/events')}
            className="bg-white hover:bg-accent-50 text-accent-700 font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaCalendar className="inline-block mr-2" />
            Create Event
          </button>
          <button 
            onClick={() => navigate('/admin/gallery')}
            className="bg-white hover:bg-blue-50 text-blue-700 font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            Upload to Gallery
          </button>
          <button 
            onClick={() => navigate('/admin/blog')}
            className="bg-white hover:bg-red-50 text-red-700 font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            New Blog Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
