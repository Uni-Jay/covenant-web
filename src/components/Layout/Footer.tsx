import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeart,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-accent-900 text-gray-200">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/80 to-transparent"></div>
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/image/New_Logo.png" 
                alt="Household Of Covenant And Faith Apostolic Ministry Logo" 
                className="w-20 h-20 md:w-24 md:h-24 object-contain"
              />
              <div>
                <h3 className="text-white text-lg font-heading font-bold leading-tight">
                  Household Of Covenant And Faith Apostolic Ministry
                </h3>
                <p className="text-[11px] uppercase tracking-[0.15em] text-secondary-200 font-semibold mt-1">
                  "Household of the living God" - 1 Timothy 3:15
                </p>
              </div>
            </div>
            <p className="text-sm mb-4">
              A place where faith comes alive, families are strengthened, and
              lives are transformed by God's love.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/1J3U5WtaQH/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-secondary-300 transition-colors transform hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://x.com/HMinistry85962"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-secondary-300 transition-colors transform hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://www.instagram.com/hocfam.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-accent-300 transition-colors transform hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://www.youtube.com/channel/UC4NQoNY0b7CcLAogvSZo2Lg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-accent-300 transition-colors transform hover:scale-110"
                aria-label="YouTube"
              >
                <FaYoutube size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-heading font-bold mb-4 border-b border-secondary-500/60 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors hover:pl-2 block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/sermons" className="hover:text-primary-400 transition-colors hover:pl-2 block">
                  Sermons
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-primary-400 transition-colors hover:pl-2 block">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/ministries" className="hover:text-secondary-300 transition-colors hover:pl-2 block">
                  Ministries
                </Link>
              </li>
              <li>
                <Link to="/bible-study" className="hover:text-primary-400 transition-colors hover:pl-2 block">
                  Bible Study
                </Link>
              </li>
              <li>
                <Link to="/prayer-request" className="hover:text-primary-400 transition-colors hover:pl-2 block">
                  Prayer Request
                </Link>
              </li>
              <li>
                <Link to="/live" className="hover:text-primary-400 transition-colors hover:pl-2 block">
                  Live Stream
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="text-white text-lg font-heading font-bold mb-4 border-b border-accent-500/60 pb-2 inline-block">Service Times</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between hover:bg-primary-900/30 p-1 rounded">
                <span>Sunday School:</span>
                <span className="text-secondary-300 font-semibold">8:00 AM - 9:00 AM</span>
              </li>
              <li className="flex justify-between hover:bg-primary-900/30 p-1 rounded">
                <span>Sunday Service:</span>
                <span className="text-secondary-300 font-semibold">9:00 AM - 11:00 AM</span>
              </li>
              <li className="flex justify-between hover:bg-primary-900/30 p-1 rounded">
                <span>Prayer Hour:</span>
                <span className="text-secondary-300 font-semibold">Tuesday 6:00 PM - 7:00 PM</span>
              </li>
              <li className="flex justify-between hover:bg-primary-900/30 p-1 rounded">
                <span>Bible Study:</span>
                <span className="text-secondary-300 font-semibold">Thursday 6:00 PM - 7:00 PM</span>
              </li>
              <li className="flex justify-between hover:bg-primary-900/30 p-1 rounded">
                <span>Monthly Vigil:</span>
                <span className="text-secondary-300 font-semibold">Last Friday 11:00 PM - 4:00 AM</span>
              </li>
              <li className="flex justify-between hover:bg-primary-900/30 p-1 rounded">
                <span>Youth Service:</span>
                <span className="text-secondary-300 font-semibold">Saturday 4:00 PM</span>
              </li>
            </ul>
            <Link
              to="/live"
              className="mt-4 inline-block bg-gradient-to-r from-accent-700 to-accent-800 text-white px-6 py-3 rounded-xl hover:from-accent-800 hover:to-accent-900 transition-all shadow-lg hover:shadow-xl text-sm font-semibold"
            >
              Watch Live
            </Link>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-heading font-bold mb-4 border-b border-secondary-500/60 pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3 hover:bg-primary-900/30 p-2 rounded transition-colors">
                <FaMapMarkerAlt className="text-secondary-400 mt-1 flex-shrink-0" />
                <span>
                  140, Obafemi Awolowo Road, Radio Bus stop, Ikorodu, Lagos
                  Nigeria
                </span>
              </li>
              <li className="flex items-start space-x-3 hover:bg-primary-900/30 p-2 rounded transition-colors">
                <FaPhone className="text-secondary-400 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <a href="tel:+2348137531119" className="block hover:text-secondary-300">
                    0813-753-1119
                  </a>
                  <a href="tel:+2348053766702" className="block hover:text-secondary-300">
                    0805-376-6702
                  </a>
                  <a href="tel:+2349076052317" className="block hover:text-secondary-300">
                    0907-605-2317
                  </a>
                </div>
              </li>
              <li className="flex items-center space-x-3 hover:bg-primary-900/30 p-2 rounded transition-colors">
                <FaEnvelope className="text-secondary-400 flex-shrink-0" />
                <a
                  href="mailto:info@hocfam.org"
                  className="hover:text-secondary-300"
                >
                  info@hocfam.org
                </a>
              </li>
            </ul>
            <Link
              to="/donate"
              className="mt-4 inline-flex items-center space-x-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-6 py-3 rounded-xl hover:from-secondary-600 hover:to-secondary-700 transition-all shadow-lg hover:shadow-xl text-sm font-semibold"
            >
              <FaHeart />
              <span>Give Online</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10 bg-gradient-to-r from-primary-900 to-accent-900">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} Household Of Covenant And Faith Apostolic Ministry. All
              rights reserved.
            </p>
            <p className="mt-2 md:mt-0 flex items-center">
              Made with <FaHeart className="inline text-red-500 mx-1" /> for God's
              Glory
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
