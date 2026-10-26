import { Link } from 'react-router-dom';
import { FaPlay, FaCalendar, FaPray, FaHeart, FaBook, FaHeadphones } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { contentAPI, galleryAPI, getAssetUrl, sermonsAPI } from '../utils/api';
import { Sermon } from '../types';
import BrandImage from '../components/BrandImage';

import { MAP_EMBED, DIRECTIONS } from '../utils/church';

const Home = () => {
  const [bibleStudyTime, setBibleStudyTime] = useState('Thursday 6:00 PM - 7:00 PM');
  const [isLive, setIsLive] = useState(false);
  const [liveTitle, setLiveTitle] = useState('');
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [churchPhoto, setChurchPhoto] = useState('');

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

    contentAPI.getLiveStream()
      .then((r) => { setIsLive(!!r.data?.isLive); setLiveTitle(r.data?.currentService?.title || ''); })
      .catch(() => {});
    sermonsAPI.getAll()
      .then((r) => {
        const list: Sermon[] = Array.isArray(r.data) ? r.data : [];
        setSermons([...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3));
      })
      .catch(() => {});
    galleryAPI.getAll()
      .then((r) => {
        const list: any[] = Array.isArray(r.data) ? r.data : [];
        const pick = list.find((g) => g.category === 'building') || list.find((g) => g.category === 'worship');
        if (pick?.imageUrl) setChurchPhoto(getAssetUrl(pick.imageUrl));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page-shell">
      {/* Hero Section */}
      <section className="page-hero min-h-[88vh] md:min-h-screen flex items-center py-12">
        <div className="absolute inset-0 bg-black/35"></div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center"
          >
            <div>
              <div className="verse-kicker mb-5">Apostolic Ministry • Ikorodu</div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-extrabold mb-5 leading-[0.95] tracking-tight max-w-4xl">
                A Church Family Built On Covenant, Truth, and Living Faith.
              </h1>
              <div className="liturgy-rule mb-4"></div>
              <p className="text-lg sm:text-xl md:text-2xl text-secondary-100/95 mb-7 max-w-2xl font-medium">
                "Household of the living God" - 1 Timothy 3:15
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/live" className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto">
                  <FaPlay />
                  <span>Join Live Worship</span>
                </Link>
                <Link to="/events" className="btn-secondary w-full sm:w-auto text-center">
                  See Gathering Calendar
                </Link>
                <Link to="/about" className="btn-outline w-full sm:w-auto text-center bg-white/10 border-white text-white hover:bg-white hover:text-primary-700">
                  Our Story
                </Link>
              </div>
            </div>

            <div className="surface-glass p-6 md:p-7 text-primary-900">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-accent-700 mb-2">This Week At Covenant</p>
              <h3 className="text-2xl md:text-3xl font-heading font-extrabold mb-4 leading-tight">Gather, Grow, and Be Sent</h3>
              <div className="space-y-3">
                <div className="faith-strip">
                  <p className="text-sm text-primary-700 font-semibold">Sunday Service</p>
                  <p className="text-primary-900 font-bold">9:00 AM - 11:00 AM</p>
                </div>
                <div className="faith-strip">
                  <p className="text-sm text-primary-700 font-semibold">Bible Study</p>
                  <p className="text-primary-900 font-bold">{bibleStudyTime}</p>
                </div>
                <div className="faith-strip">
                  <p className="text-sm text-primary-700 font-semibold">Prayer Hour</p>
                  <p className="text-primary-900 font-bold">Tuesday 6:00 PM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live now banner: Church Studio switches this on when the service starts */}
      {isLive && (
        <section className="bg-red-600 text-white">
          <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="flex items-center gap-3 font-bold text-lg">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
              </span>
              We're live now{liveTitle ? `: ${liveTitle}` : ''}
            </p>
            <Link to="/live" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 font-bold text-red-600 hover:bg-red-50">
              <FaPlay /> Watch now
            </Link>
          </div>
        </section>
      )}

      {/* Welcome Section */}
      <section className="py-16 md:py-24 bg-white/85">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm uppercase tracking-[0.2em] text-accent-700 font-bold mb-3">Who We Are</p>
              <h2 className="section-title">Welcome Home</h2>
              <p className="section-subtitle">A place where faith comes alive</p>
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
              <BrandImage
                src={churchPhoto}
                alt="Household Of Covenant And Faith Apostolic Ministry"
                className="w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl border border-primary-100"
              />
                <div className="absolute -bottom-5 left-6 bg-white px-5 py-3 rounded-xl border border-primary-100 shadow-lg">
                  <p className="text-xs uppercase tracking-[0.18em] text-accent-700 font-bold">Lagos • Ikorodu</p>
                  <p className="text-primary-900 font-bold">A church family for every generation</p>
                </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
        <div className="container-custom text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-accent-700 font-bold mb-3">Weekly Rhythm</p>
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
                className="editorial-card p-5 md:p-6"
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
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-primary-50/40">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-5 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="editorial-card p-6 md:p-8 text-center"
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
              className="editorial-card p-6 md:p-8 text-center"
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
              className="editorial-card p-6 md:p-8 text-center"
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
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50/80 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Latest Sermons</h2>
            <p className="section-subtitle">
              Visit our full sermon library for all messages and media
            </p>
          </div>
          {sermons.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {sermons.map((sermon) => (
                <Link key={sermon.id} to="/sermons" className="editorial-card overflow-hidden group block p-0">
                  <BrandImage
                    src={getAssetUrl(sermon.thumbnailUrl)}
                    alt={sermon.title}
                    label={sermon.preacher}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-accent-700 font-bold mb-2">
                      {new Date(sermon.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <h3 className="text-lg font-bold leading-snug group-hover:text-primary-600 transition-colors">{sermon.title}</h3>
                    {sermon.preacher && <p className="text-gray-600 text-sm mt-1">{sermon.preacher}</p>}
                    <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
                      {sermon.audioUrl ? <><FaHeadphones /> Listen</> : <><FaPlay /> Watch</>}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="editorial-card p-6 md:p-10 text-center max-w-3xl mx-auto">
              <p className="text-gray-700 mb-5 md:mb-6">
                Messages from our services will appear here. Meanwhile, join us live on Sunday.
              </p>
              <Link to="/live" className="btn-secondary inline-block">
                Watch Live Service
              </Link>
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/sermons" className="btn-primary">
              View All Sermons
            </Link>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 md:py-24 bg-white/85">
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
                  <span className="space-y-1">
                    <div>0813-753-1119</div>
                    <div>0805-376-6702</div>
                    <div>0907-605-2317</div>
                  </span>
                </p>
                <p className="flex items-start gap-2 md:gap-3">
                  <span className="font-bold shrink-0">Email:</span>
                  <span>info@hocfam.org</span>
                </p>
              </div>
              <a href={DIRECTIONS} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 inline-block">
                Get Directions
              </a>
            </div>
            <div className="h-72 md:h-96 bg-gray-200 rounded-2xl overflow-hidden">
              <iframe
                src={MAP_EMBED}
                title="Map to the church"
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
