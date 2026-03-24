import { useEffect, useState } from 'react';
import { FaPlay, FaCircle, FaYoutube, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { contentAPI } from '../utils/api';

const YOUTUBE_CHANNEL_ID = 'UC4NQoNY0b7CcLAogvSZo2Lg';
const YOUTUBE_LIVE_URL = `https://www.youtube.com/embed/live/${YOUTUBE_CHANNEL_ID}`;
const YOUTUBE_CHANNEL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`;

const LiveStream = () => {
  const [loading, setLoading] = useState(true);
  const [streamData, setStreamData] = useState<any>(null);
  const [isLiveNow, setIsLiveNow] = useState(false);

  useEffect(() => {
    fetchStreamData();
    checkLiveStatus();
    // Check live status every 30 seconds
    const interval = setInterval(checkLiveStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStreamData = async () => {
    try {
      const response = await contentAPI.getLiveStream();
      setStreamData(response.data);
    } catch (error) {
      console.error('Failed to load live stream data:', error);
      // Set default data if API fails
      setStreamData({
        serviceTimes: [
          { title: 'Sunday Service', time: '9:00 AM - 11:00 AM', day: 'Sunday' },
          { title: 'Prayer Hour', time: '6:00 PM - 7:00 PM', day: 'Tuesday' },
          { title: 'Bible Study', time: '6:00 PM - 7:00 PM', day: 'Thursday' }
        ],
        previousServices: []
      });
    } finally {
      setLoading(false);
    }
  };

  const checkLiveStatus = async () => {
    try {
      // Check if it's within service times
      const now = new Date();
      const day = now.toLocaleDateString('en-US', { weekday: 'long' });
      const time = now.toLocaleTimeString('en-US', { hour12: false });
      
      const isWithinServiceTime = streamData?.serviceTimes?.some((service: any) => {
        if (service.day === day) {
          const [startStr, endStr] = service.time.split(' - ');
          const start = convertTo24Hour(startStr);
          const end = convertTo24Hour(endStr);
          return time >= start && time <= end;
        }
        return false;
      });
      
      setIsLiveNow(isWithinServiceTime || false);
    } catch (error) {
      console.error('Error checking live status:', error);
    }
  };

  const convertTo24Hour = (timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-900 via-secondary-700 to-accent-800 text-white py-14">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-gold-200 mb-3">Broadcast Chapel</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">Live Stream</h1>
              <p className="text-xl">Join us for live worship and the Word</p>
            </div>
            <div className="flex flex-col gap-3">
              {isLiveNow && (
                <div className="flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-full animate-pulse justify-center">
                  <FaCircle className="text-sm" />
                  <span className="font-bold">LIVE NOW</span>
                </div>
              )}
              <a
                href={YOUTUBE_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full font-bold transition-colors"
              >
                <FaYoutube className="text-lg" />
                <span>Subscribe</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Video Player */}
      <section className="py-8">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center items-center h-64"><div className="spinner"></div></div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black rounded-xl overflow-hidden shadow-2xl"
              >
                {isLiveNow ? (
                  <iframe
                    width="100%"
                    height="600"
                    src={YOUTUBE_LIVE_URL}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Church Live Stream"
                  ></iframe>
                ) : (
                  <div className="h-[600px] flex flex-col items-center justify-center text-white bg-gradient-to-b from-gray-800 to-black">
                    <FaPlay className="text-8xl mb-6 text-gray-600" />
                    <h2 className="text-3xl font-bold mb-4">Stream is Offline</h2>
                    <p className="text-xl text-gray-400 mb-2">
                      We're not live right now.
                    </p>
                    <p className="text-lg text-gray-500 mb-8">
                      Check our service times below or visit our YouTube channel
                    </p>
                    <div className="flex gap-4">
                      <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                        Visit YouTube Channel
                      </a>
                      <Link to="/sermons" className="btn-secondary">
                        Watch Past Sermons
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Service Times & Info */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="editorial-card p-6 md:col-span-2 border border-primary-100/80">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FaClock className="text-primary-600" />
                    Service Times
                  </h3>
                  <div className="space-y-4">
                    {streamData?.serviceTimes?.map((service: any, index: number) => (
                      <div key={index} className="border-l-4 border-primary-600 pl-4 py-2">
                        <p className="font-bold text-lg text-gray-900">{service.title}</p>
                        <p className="text-gray-600">{service.day}</p>
                        <p className="text-primary-600 font-semibold">{service.time}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="editorial-card p-6 bg-primary-50/90 border border-primary-100/80">
                  <h3 className="text-xl font-bold mb-4">Join Live Stream</h3>
                  <p className="text-gray-600 mb-4">
                    Join us for inspiring worship, powerful messages, and meaningful fellowship.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>✓ Monday - Friday: Prayer & Worship</p>
                    <p>✓ Sundays: Full Service</p>
                    <p>✓ All sessions live on YouTube</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Previous Services */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-primary-950">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-white mb-8">Sermon Archive</h2>
          {streamData?.previousServices && streamData.previousServices.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {streamData.previousServices.map((item: any) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/15 hover:border-white/35 hover:shadow-2xl transition-all"
                >
                  <div className="relative">
                    <img
                      src={item.imageUrl || item.thumbnail}
                      alt="Sermon"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 flex items-center justify-center transition-all">
                      <FaPlay className="text-white text-4xl opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                    <p className="text-gray-400 mb-4 text-sm">
                      {item.speaker && `By ${item.speaker} • `}
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                    <a
                      href={item.youtubeUrl || YOUTUBE_CHANNEL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full inline-block text-center"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">Sermons coming soon</p>
              <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
                Subscribe to Our YouTube Channel
              </a>
            </div>
          )}
        </div>
      </section>

      {/* YouTube Channel CTA */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <FaYoutube className="text-8xl mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl font-bold mb-4">Never Miss a Service</h2>
            <p className="text-xl mb-2 opacity-90">
              Subscribe to our YouTube channel to get notified when we go live
            </p>
            <p className="text-lg mb-8 opacity-75">
              Watch past sermons, prayer sessions, and ministry updates anytime
            </p>
            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-colors"
            >
              <FaYoutube className="text-2xl" />
              <span>Subscribe to @Hocfam</span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LiveStream;
