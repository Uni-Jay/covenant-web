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
        isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-primary-100 shadow-xl py-2' : 'bg-white/85 backdrop-blur-sm border-b border-white/60 py-3 shadow-md'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/image/New_Logo.png" 
              alt="Household Of Covenant And Faith Apostolic Ministry Logo" 
              className="w-14 h-14 md:w-16 md:h-16 object-contain transition-transform group-hover:scale-105"
            />
            <div className="max-w-md">
              <h1 className="text-sm md:text-base font-heading font-extrabold text-primary-900 leading-tight tracking-tight">
                Household Of Covenant And Faith Apostolic Ministry
              </h1>
              <p className="text-[11px] text-accent-700 font-semibold tracking-[0.14em] uppercase">Household of the Living God</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-semibold text-sm transition-all duration-300 relative px-1 py-2 ${
                  isActive(link.path)
                    ? 'text-primary-700'
                    : 'text-gray-700 hover:text-accent-600'
                } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all ${
                  isActive(link.path) 
                    ? 'after:w-full after:bg-primary-700' 
                    : 'after:w-0 hover:after:w-full hover:after:bg-accent-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user && (user.role === 'admin' || user.role === 'super_admin') && (
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="px-4 py-2 bg-gradient-to-r from-primary-700 to-accent-700 text-white rounded-xl text-sm font-semibold hover:from-primary-800 hover:to-accent-800 transition-all shadow-md hover:shadow-lg"
              >
                Admin Dashboard
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 border-2 border-accent-600 text-accent-600 hover:bg-accent-600 hover:text-white rounded-lg font-semibold transition-all"
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
          <nav className="lg:hidden mt-4 pb-4 border-t-2 border-primary-200 pt-4 bg-gradient-to-b from-white to-primary-50 rounded-lg px-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 font-semibold rounded-lg px-3 my-1 transition-all ${
                  isActive(link.path)
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-primary-100 hover:text-accent-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                {(user.role === 'admin' || user.role === 'super_admin') && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block py-3 my-2 font-semibold bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg text-center"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block py-3 my-2 font-semibold border-2 border-accent-600 text-accent-600 hover:bg-accent-600 hover:text-white rounded-lg w-full text-center transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block py-3 my-2 font-semibold bg-primary-600 text-white rounded-lg text-center hover:bg-primary-700 transition-all"
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
