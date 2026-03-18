import { Link } from 'react-router-dom';
import { FaPlay, FaCalendar, FaPray, FaHeart, FaBook, FaApple, FaAndroid } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { contentAPI } from '../utils/api';

const Home = () => {
  const [bibleStudyTime, setBibleStudyTime] = useState('Thursday 6:00 PM - 7:00 PM');

  useEffect(() => {
    const fetchBibleStudyTime = async () => {
      try {
        const response = await contentAPI.getBibleStudy(true);
        const serverTime = response.data?.weeklyStudy?.time;
        if (serverTime) {
          setBibleStudyTime(serverTime);
        }
      } catch (error) {
        // Keep default schedule if API is unavailable.
      }
    };

    fetchBibleStudyTime();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[88vh] md:min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-12">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight">
              Welcome to Household Of Covenant And Faith Apostolic Ministry
            </h1>
            <p className="text-lg sm:text-2xl md:text-3xl mb-3 md:mb-4 italic text-gold-300">
              "Household of the living God"
            </p>
            <p className="text-base sm:text-xl mb-6 md:mb-8">- 1 Timothy 3:15</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:items-center max-w-xl mx-auto">
              <Link to="/live" className="btn-primary inline-flex items-center justify-center space-x-2 w-full sm:w-auto">
                <FaPlay />
                <span>Watch Live</span>
              </Link>
              <Link to="/events" className="btn-secondary w-full sm:w-auto text-center">
                Upcoming Events
              </Link>
              <Link to="/about" className="btn-outline w-full sm:w-auto text-center bg-white/10 border-white text-white hover:bg-white hover:text-primary-600">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile App Download Section */}
      <section className="py-14 md:py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Get Our Mobile App</h2>
              <p className="text-lg md:text-xl text-gray-100">
                Stay connected with church updates, attend services, and give offerings on the go
              </p>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Android Download */}
            <motion.a
              href="https://github.com/Uni-Jay/covenant-mobile/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center gap-3 px-6 py-4 md:py-5 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg"
            >
              <FaAndroid className="text-2xl md:text-3xl" />
              <div className="text-left">
                <p className="text-xs md:text-sm">Download APK</p>
                <p className="text-lg md:text-xl">Android App</p>
              </div>
            </motion.a>

            {/* iOS Download */}
            <motion.a
              href="https://github.com/Uni-Jay/covenant-mobile/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center justify-center gap-3 px-6 py-4 md:py-5 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg"
            >
              <FaApple className="text-2xl md:text-3xl" />
              <div className="text-left">
                <p className="text-xs md:text-sm">Download for</p>
                <p className="text-lg md:text-xl">iOS App</p>
              </div>
            </motion.a>
          </div>
          <div className="text-center mt-8">
            <p className="text-sm md:text-base text-gray-100">
              Direct downloads available. Contact us for iOS TestFlight access.
            </p>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">Welcome Home</h2>
              <p className="section-subtitle">
                A place where faith comes alive
              </p>
              <p className="text-gray-700 mb-6">
                At Household Of Covenant And Faith Apostolic Ministry, we are a community of believers dedicated to spreading the love of Christ and serving our community. Located at 140, Obafemi Awolowo Road, Radio Bus stop, Ikorodu, Lagos Nigeria, we welcome you to join our family.
              </p>
              <p className="text-gray-700 mb-6">
                Whether you're seeking spiritual growth, fellowship, or a place to call home, we invite you to experience God's presence with us.
              </p>
              <Link to="/about" className="btn-primary">
                Discover Our Story
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800"
                alt="Church Building"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="section-title">Join Us For Worship</h2>
          <p className="section-subtitle">We can't wait to meet you!</p>
          <div className="grid md:grid-cols-5 gap-4 sm:gap-6 mt-10 md:mt-12">
            {[
              { day: 'Sunday School', time: '8:00 AM - 9:00 AM', icon: FaBook },
              { day: 'Sunday Service', time: '9:00 AM - 11:00 AM', icon: FaBook },
              { day: 'Prayer Hour', time: 'Tuesday 6:00 PM - 7:00 PM', icon: FaPray },
              { day: 'Bible Study', time: bibleStudyTime, icon: FaBook },
              { day: 'Monthly Vigil', time: 'Last Friday 11:00 PM - 4:00 AM', icon: FaPray },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-5 md:p-6"
              >
                <service.icon className="text-4xl md:text-5xl text-primary-600 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-bold mb-2">{service.day}</h3>
                <p className="text-sm md:text-base text-gray-600">{service.time}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-5 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="card p-6 md:p-8 text-center"
            >
              <FaCalendar className="text-4xl md:text-5xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Upcoming Events</h3>
              <p className="text-gray-600 mb-6">
                Stay connected with church activities, programs, and special events.
              </p>
              <Link to="/events" className="btn-primary">
                View Events
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6 md:p-8 text-center"
            >
              <FaPray className="text-4xl md:text-5xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Prayer Request</h3>
              <p className="text-gray-600 mb-6">
                Share your prayer needs with us. We're here to pray with you.
              </p>
              <Link to="/prayer-request" className="btn-primary">
                Submit Request
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6 md:p-8 text-center"
            >
              <FaHeart className="text-4xl md:text-5xl text-gold-500 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Give Online</h3>
              <p className="text-gray-600 mb-6">
                Support God's work through your generous giving and offerings.
              </p>
              <Link to="/donate" className="btn-secondary">
                Give Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest Sermons */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Latest Sermons</h2>
            <p className="section-subtitle">
              Visit our full sermon library for all messages and media
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="card p-6 md:p-10 text-center max-w-3xl mx-auto"
          >
            <p className="text-gray-700 mb-5 md:mb-6">
              Watch recent sermons, listen to audio messages, and download teaching materials from our sermons page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/sermons" className="btn-primary w-full sm:w-auto text-center">
                Open Sermons Page
              </Link>
              <Link to="/live" className="btn-secondary w-full sm:w-auto text-center">
                Watch Live Service
              </Link>
            </div>
          </motion.div>
          <div className="text-center mt-12">
            <Link to="/sermons" className="btn-primary">
              View All Sermons
            </Link>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="section-title">Visit Us</h2>
              <p className="section-subtitle">We'd love to see you!</p>
              <div className="space-y-4 text-gray-700">
                <p className="flex items-start gap-2 md:gap-3">
                  <span className="font-bold shrink-0">Address:</span>
                  <span>140, Obafemi Awolowo Road, Radio Bus stop, Ikorodu, Lagos Nigeria</span>
                </p>
                <p className="flex items-start gap-2 md:gap-3">
                  <span className="font-bold shrink-0">Phone:</span>
                  <span>+234 801 234 5678</span>
                </p>
                <p className="flex items-start gap-2 md:gap-3">
                  <span className="font-bold shrink-0">Email:</span>
                  <span>info@hocfam.org</span>
                </p>
              </div>
              <Link to="/contact" className="btn-primary mt-6 inline-block">
                Get Directions
              </Link>
            </div>
            <div className="h-72 md:h-96 bg-gray-200 rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.375295315134229!3d6.515398895328511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d65b!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
