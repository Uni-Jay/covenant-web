import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaChurch, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWarning('');

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      if (response.data?.emailDelivered === false) {
        setWarning(response.data?.warning || 'Reset request was created, but email delivery could not be confirmed.');
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-secondary-900 to-accent-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMCAwIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          
          {/* Floating Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary-500 rounded-full filter blur-3xl"
          />
        </div>

        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-md z-10"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-center mb-6"
            >
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full filter blur-xl opacity-50"></div>
                <FaCheckCircle className="w-24 h-24 mx-auto text-secondary-400 relative z-10 drop-shadow-2xl" />
              </div>
            </motion.div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                Check Your Email
              </h1>
              <p className="text-white/80 text-lg">
                We've sent a password reset link to:
              </p>
              <p className="text-secondary-300 font-semibold mt-2">{email}</p>
            </div>

            {warning && (
              <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4 mb-6">
                <p className="text-yellow-200 text-sm text-center">{warning}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-secondary-400">📧</span>
                Next Steps:
              </h3>
              <ol className="text-white/80 space-y-2 text-sm">
                <li>1. Check your email inbox for reset link</li>
                <li>2. Click the link in the email</li>
                <li>3. Create a new password</li>
                <li>4. Sign in with your new password</li>
              </ol>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-6">
              <p className="text-white/70 text-sm text-center">
                <strong className="text-white">Didn't receive the email?</strong><br />
                Check your spam folder or wait a few minutes and try again.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 hover:from-primary-500 hover:via-secondary-500 hover:to-accent-500 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  Back to Sign In
                </motion.button>
              </Link>
              
              <Link to="/" className="block text-center">
                <span className="text-white/70 hover:text-white transition-colors">
                  ← Back to Home
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-secondary-900 to-accent-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMCAwIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        {/* Floating Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500 rounded-full filter blur-3xl"
        />
      </div>

      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
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
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full filter blur-xl opacity-50"></div>
              <img 
                src="/image/New_Logo.png" 
                alt="Logo" 
                className="w-24 h-24 mx-auto mb-4 object-contain relative z-10 drop-shadow-2xl"
              />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Forgot Password?
            </h1>
            <p className="text-white/80 text-lg">No worries, we'll send you reset instructions</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <FaChurch className="text-secondary-400" />
              <span className="text-white/60 text-sm">Word of Covenant</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-accent-500/20 border border-accent-500/50 rounded-xl text-white text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold mb-2 text-white/90">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 z-10" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent transition-all relative"
                  placeholder="you@example.com"
                />
              </div>
              <p className="mt-2 text-xs text-white/60">
                Enter the email address associated with your account
              </p>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 hover:from-primary-500 hover:via-secondary-500 hover:to-accent-500 text-white font-bold rounded-xl shadow-lg shadow-primary-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 space-y-4"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/60">Remember your password?</span>
              </div>
            </div>

            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-secondary-300 hover:text-secondary-200 transition-colors font-semibold"
              >
                <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                <span>Back to Sign In</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary-500/30 rounded-full filter blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-500/30 rounded-full filter blur-2xl"></div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
