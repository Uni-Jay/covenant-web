import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  FaTachometerAlt,
  FaBook,
  FaCalendar,
  FaImages,
  FaBlog,
  FaUsers,
  FaPray,
  FaHeart,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/admin', icon: FaTachometerAlt, label: 'Dashboard', exact: true },
    { path: '/admin/sermons', icon: FaBook, label: 'Sermons' },
    { path: '/admin/events', icon: FaCalendar, label: 'Events' },
    { path: '/admin/bible-study', icon: FaBook, label: 'Bible Study' },
    { path: '/admin/gallery', icon: FaImages, label: 'Gallery' },
    { path: '/admin/blog', icon: FaBlog, label: 'Blog' },
    { path: '/admin/members', icon: FaUsers, label: 'Members' },
    { path: '/admin/prayer-requests', icon: FaPray, label: 'Prayer Requests' },
    { path: '/admin/donations', icon: FaHeart, label: 'Donations' },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          {sidebarOpen ? (
            <div className="flex items-center space-x-2">
              <img 
                src="/image/New_Logo.png" 
                alt="Word of Covenant Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="font-bold text-lg">WCC Admin</span>
            </div>
          ) : (
            <img 
              src="/image/New_Logo.png" 
              alt="Word of Covenant Logo" 
              className="w-10 h-10 object-contain mx-auto"
            />
          )}
          {sidebarOpen && (
            <div>
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <p className="text-xs text-gray-400">Media Department</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive(item.path, item.exact)
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="text-xl flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-800">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center space-x-3 p-3 w-full rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <FaSignOutAlt className="text-xl" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              Household Of Covenant And Faith Apostolic Ministry - Admin
            </h1>
            <Link
              to="/"
              className="text-primary-600 hover:underline"
            >
              View Website →
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
