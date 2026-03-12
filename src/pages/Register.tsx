import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaChurch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-accent-900 to-secondary-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMCAwIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        {/* Floating Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute top-20 right-1/4 w-96 h-96 bg-accent-500 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 11, repeat: Infinity }}
          className="absolute bottom-20 left-1/3 w-96 h-96 bg-secondary-500 rounded-full filter blur-3xl"
        />
      </div>

      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl z-10"
      >
        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-secondary-500 rounded-full filter blur-xl opacity-50"></div>
              <img 
                src="/image/New_Logo.png" 
                alt="Logo" 
                className="w-24 h-24 mx-auto mb-4 object-contain relative z-10 drop-shadow-2xl"
              />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Join Our Community
            </h1>
            <p className="text-white/80 text-lg">Create your account to get started</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <FaChurch className="text-secondary-400" />
              <span className="text-white/60 text-sm">Covenant Family Registration</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold mb-2 text-white/90">First Name</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-secondary-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 z-10" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent transition-all relative"
                    placeholder="John"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold mb-2 text-white/90">Last Name</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-secondary-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 z-10" />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent transition-all relative"
                    placeholder="Doe"
                  />
                </div>
              </motion.div>
            </div>

            {/* Email Field */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold mb-2 text-white/90">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 z-10" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent transition-all relative"
                  placeholder="you@example.com"
                />
              </div>
            </motion.div>

            {/* Phone Field */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <label className="block text-sm font-semibold mb-2 text-white/90">Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 z-10" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent transition-all relative"
                  placeholder="+234 801 234 5678"
                />
              </div>
            </motion.div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-semibold mb-2 text-white/90">Password</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-secondary-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 z-10" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent transition-all relative"
                    placeholder="••••••••"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-semibold mb-2 text-white/90">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-secondary-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 z-10" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent transition-all relative"
                    placeholder="••••••••"
                  />
                </div>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-accent-600 via-secondary-600 to-primary-600 hover:from-accent-500 hover:via-secondary-500 hover:to-primary-500 text-white font-bold rounded-xl shadow-lg shadow-accent-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 space-y-4"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/60">Welcome to Covenant</span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-white/70">
                Already have an account?{' '}
                <Link to="/login" className="text-secondary-300 hover:text-secondary-200 font-semibold transition-colors">
                  Sign In
                </Link>
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
              >
                <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                <span>Back to Home</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent-500/30 rounded-full filter blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-secondary-500/30 rounded-full filter blur-2xl"></div>
      </motion.div>
    </div>
  );
};

export default Register;
