import { FaHeart, FaUniversity, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCopy } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Donate = () => {
  const accountNumber = '1234567890';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Account number copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gold-600 to-gold-800 text-white py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaHeart className="text-6xl mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Give to God's Work</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Your generosity enables us to spread the Gospel, serve our community, and make a lasting impact for God's Kingdom.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bank Account Details */}
      <section className="py-12">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 md:p-12"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Bank Account Details</h2>
            <p className="text-center text-gray-600 mb-8">Support God's work through your generous giving. You can make donations via bank transfer to the account below:</p>
            
            <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-8 mb-8">
              <div className="flex items-center justify-center mb-6">
                <FaUniversity className="text-5xl text-primary-600" />
              </div>
              <div className="space-y-4 text-center">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bank Name</p>
                  <p className="text-2xl font-bold text-gray-900">First Bank Nigeria</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Account Name</p>
                  <p className="text-2xl font-bold text-gray-900">Household Of Covenant And Faith Apostolic Ministry</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Account Number</p>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-3xl font-bold text-primary-600 tracking-wide">{accountNumber}</p>
                    <button
                      onClick={() => copyToClipboard(accountNumber)}
                      className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                      title="Copy account number"
                    >
                      <FaCopy className="text-primary-600 text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-center">Giving Options</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-primary-600 mb-2">
                    <FaUniversity className="text-3xl mx-auto" />
                  </div>
                  <h4 className="font-semibold mb-2">Tithes</h4>
                  <p className="text-sm text-gray-600">Return 10% of your income to God</p>
                </div>
                <div>
                  <div className="text-primary-600 mb-2">
                    <FaHeart className="text-3xl mx-auto" />
                  </div>
                  <h4 className="font-semibold mb-2">Offerings</h4>
                  <p className="text-sm text-gray-600">General church support</p>
                </div>
                <div>
                  <div className="text-primary-600 mb-2">
                    <FaUniversity className="text-3xl mx-auto" />
                  </div>
                  <h4 className="font-semibold mb-2">Special Projects</h4>
                  <p className="text-sm text-gray-600">Building fund, missions, etc.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-700 mb-4">After making your transfer, please send confirmation with your name and purpose to:</p>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <FaEnvelope className="text-primary-600" />
                  <a href="mailto:info@wordofcovenant.org" className="text-primary-600 hover:underline">info@wordofcovenant.org</a>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <FaPhone className="text-primary-600" />
                  <a href="tel:+2348012345678" className="text-primary-600 hover:underline">+234 801 234 5678</a>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-8 mt-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Questions About Giving?</h3>
            <p className="mb-6">Contact our finance department for any inquiries</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt />
                <span>140, Obafemi Awolowo Road, Ikorodu, Lagos</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhone />
                <span>+234 801 234 5678</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
