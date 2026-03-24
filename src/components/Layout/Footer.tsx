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
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#200f35] via-[#3a1f58] to-[#241237] text-gray-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent"></div>
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-[#6d3da0]/35 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-[#d4af37]/25 blur-3xl"></div>

      <div className="container-custom relative py-10">
        <div className="mb-10 rounded-2xl border border-gold-300/50 bg-[#2b1542]/70 px-6 py-6 backdrop-blur-sm md:px-8 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold-300 font-bold mb-2">Covenant Invitation</p>
              <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-white leading-tight">Worship With Us This Week</h3>
              <p className="mt-2 text-sm md:text-base text-gray-100/90 max-w-2xl">Come and encounter God through heartfelt worship, sound teaching, and a family of believers committed to faith and love.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/live" className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-3 text-center text-sm font-bold text-[#2a1242] hover:from-gold-400 hover:to-gold-500 transition-all">
                Watch Live Service
              </Link>
              <Link to="/contact" className="rounded-xl border border-gold-300/60 bg-[#ffffff0f] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#ffffff1a] transition-all">
                Plan A Visit
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-start gap-4">
              <img
                src="/image/New_Logo.png"
                alt="Household Of Covenant And Faith Apostolic Ministry Logo"
                className="h-20 w-20 object-contain md:h-24 md:w-24"
              />
              <div>
                <h3 className="text-xl font-heading font-extrabold text-white leading-tight">Household Of Covenant And Faith Apostolic Ministry</h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-gold-200 font-semibold">Household of the living God • 1 Timothy 3:15</p>
              </div>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-100/90">A Christ-centered family where lives are transformed, generations are discipled, and the gospel is carried with conviction and compassion.</p>

            <div className="mt-6 flex items-center gap-4">
              <a href="https://www.facebook.com/share/1J3U5WtaQH/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gold-300/40 p-2 text-gold-100 hover:border-gold-300 hover:bg-gold-300/10 hover:text-gold-200 transition-all" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="https://x.com/HMinistry85962" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gold-300/40 p-2 text-gold-100 hover:border-gold-300 hover:bg-gold-300/10 hover:text-gold-200 transition-all" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="https://www.instagram.com/hocfam.ng" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gold-300/40 p-2 text-gold-100 hover:border-gold-300 hover:bg-gold-300/10 hover:text-gold-200 transition-all" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.youtube.com/channel/UC4NQoNY0b7CcLAogvSZo2Lg" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gold-300/40 p-2 text-gold-100 hover:border-gold-300 hover:bg-gold-300/10 hover:text-gold-200 transition-all" aria-label="YouTube">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm uppercase tracking-[0.18em] text-gold-300 font-bold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-100/90 hover:text-gold-200 transition-colors">About Us</Link></li>
              <li><Link to="/sermons" className="text-gray-100/90 hover:text-gold-200 transition-colors">Sermons</Link></li>
              <li><Link to="/events" className="text-gray-100/90 hover:text-gold-200 transition-colors">Events</Link></li>
              <li><Link to="/ministries" className="text-gray-100/90 hover:text-gold-200 transition-colors">Ministries</Link></li>
              <li><Link to="/bible-study" className="text-gray-100/90 hover:text-gold-200 transition-colors">Bible Study</Link></li>
              <li><Link to="/prayer-request" className="text-gray-100/90 hover:text-gold-200 transition-colors">Prayer Request</Link></li>
              <li><Link to="/live" className="text-gray-100/90 hover:text-gold-200 transition-colors">Live Stream</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm uppercase tracking-[0.18em] text-gold-300 font-bold mb-4">Worship Times</h4>
            <ul className="space-y-3 text-sm">
              <li className="rounded-lg border border-gold-300/25 bg-[#ffffff0d] px-3 py-2"><span className="block text-white font-semibold">Sunday School</span><span className="text-gold-200">8:00 AM - 9:00 AM</span></li>
              <li className="rounded-lg border border-gold-300/25 bg-[#ffffff0d] px-3 py-2"><span className="block text-white font-semibold">Sunday Service</span><span className="text-gold-200">9:00 AM - 11:00 AM</span></li>
              <li className="rounded-lg border border-gold-300/25 bg-[#ffffff0d] px-3 py-2"><span className="block text-white font-semibold">Prayer Hour</span><span className="text-gold-200">Tuesday 6:00 PM - 7:00 PM</span></li>
              <li className="rounded-lg border border-gold-300/25 bg-[#ffffff0d] px-3 py-2"><span className="block text-white font-semibold">Bible Study</span><span className="text-gold-200">Thursday 6:00 PM - 7:00 PM</span></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm uppercase tracking-[0.18em] text-gold-300 font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-100/90">
              <li className="flex items-start gap-2"><FaMapMarkerAlt className="mt-1 text-gold-300" /><span>140, Obafemi Awolowo Road, Radio Bus stop, Ikorodu, Lagos Nigeria</span></li>
              <li className="flex items-start gap-2"><FaPhone className="mt-1 text-gold-300" /><span>0813-753-1119<br/>0805-376-6702<br/>0907-605-2317</span></li>
              <li className="flex items-center gap-2"><FaEnvelope className="text-gold-300" /><a href="mailto:info@hocfam.org" className="hover:text-gold-200 transition-colors">info@hocfam.org</a></li>
            </ul>

            <Link to="/donate" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5f2e9a] to-[#7a3fc2] px-4 py-3 text-sm font-semibold text-white hover:from-[#6e36b0] hover:to-[#8b4dd2] transition-all border border-gold-300/30">
              <FaHeart />
              <span>Give Online</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gold-300/25 bg-[#1f1031]/80">
        <div className="container-custom py-5">
          <div className="flex flex-col gap-2 text-sm text-gray-100/85 md:flex-row md:items-center md:justify-between">
            <p>&copy; {new Date().getFullYear()} Household Of Covenant And Faith Apostolic Ministry. All rights reserved.</p>
            <p className="flex items-center">Made with <FaHeart className="mx-1 text-red-500" /> for God's glory</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
