import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Sermons', path: '/sermons' },
    { name: 'Events', path: '/events' },
    { name: 'Ministries', path: '/ministries' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-xl py-2' : 'bg-white/98 py-4 shadow-md'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/image/Word of Covenant Logo.jpg" 
              alt="Word of Covenant Church Logo" 
              className="w-14 h-14 md:w-16 md:h-16 object-contain transition-transform group-hover:scale-110"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-700 to-red-700 bg-clip-text text-transparent">
                Word of Covenant Church
              </h1>
              <p className="text-xs text-gray-600 italic">Light of the World (John 8:12)</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-semibold transition-all duration-300 relative ${
                  isActive(link.path)
                    ? 'text-blue-700'
                    : 'text-gray-700 hover:text-blue-600'
                } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all ${
                  isActive(link.path) 
                    ? 'after:w-full after:bg-blue-700' 
                    : 'after:w-0 hover:after:w-full hover:after:bg-blue-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user && user.role === 'admin' && (
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
              >
                Admin Dashboard
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-semibold transition-all"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gray-900 text-2xl"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t-2 border-blue-200 pt-4 bg-gradient-to-b from-white to-blue-50 rounded-lg px-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 font-semibold rounded-lg px-3 my-1 transition-all ${
                  isActive(link.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block py-3 my-2 font-semibold bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg text-center"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block py-3 my-2 font-semibold border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-lg w-full text-center transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block py-3 my-2 font-semibold bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-all"
              >
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
