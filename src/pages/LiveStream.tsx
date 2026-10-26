import { useEffect, useState } from 'react';
import { FaPlay, FaCircle, FaYoutube, FaClock, FaFacebook, FaHeadphones } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { contentAPI, getAssetUrl } from '../utils/api';
import BrandImage from '../components/BrandImage';

const YOUTUBE_CHANNEL_ID = 'UC4NQoNY0b7CcLAogvSZo2Lg';
const DEFAULT_CHANNEL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`;
const DEFAULT_FACEBOOK = 'https://www.facebook.com/share/1J3U5WtaQH/';
const DEFAULT_TIMES = [
  { title: 'Sunday School', time: '8:00 AM - 9:00 AM' },
  { title: 'Sunday Service', time: '9:00 AM - 11:00 AM' },
  { title: 'Prayer Hour', time: 'Tuesday 6:00 PM - 7:00 PM' },
  { title: 'Bible Study', time: 'Thursday 6:00 PM - 7:00 PM' },
  { title: 'Monthly Vigil', time: 'Last Friday 11:00 PM - 4:00 AM' },
];

type StreamInfo = {
  isLive: boolean;
  liveStreamUrl: string;
  channelUrl: string;
  facebookUrl: string;
  currentService: { title: string; description: string };
  serviceTimes: { title: string; time: string }[];
  previousServices: { id: number; title: string; preacher?: string; date: string; imageUrl?: string; videoUrl?: string; audioUrl?: string }[];
};

/** Turns a YouTube or Facebook link into something that can be played on this page. */
export function toEmbedUrl(url: string, channelId = YOUTUBE_CHANNEL_ID): string {
  const u = (url || '').trim();
  const yt = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|live\/|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`;
  if (/facebook\.com|fb\.watch/i.test(u)) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u)}&show_text=false&autoplay=true`;
  }
  // No specific video yet: YouTube shows whatever the channel is streaming right now
  return `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1`;
}

const LiveStream = () => {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<StreamInfo | null>(null);

  useEffect(() => {
    let stopped = false;
    const load = async () => {
      try {
        const response = await contentAPI.getLiveStream();
        if (!stopped) setInfo(response.data);
      } catch (error) {
        // keep whatever we had; the page still works with the defaults below
      } finally {
        if (!stopped) setLoading(false);
      }
    };
    load();
    // Church Studio tells the website when the church goes live, so check every 30 seconds
    const interval = setInterval(load, 30000);
    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, []);

  const isLive = !!info?.isLive;
  const channel = info?.channelUrl || DEFAULT_CHANNEL;
  const facebook = info?.facebookUrl || DEFAULT_FACEBOOK;
  const times = info?.serviceTimes?.length ? info.serviceTimes : DEFAULT_TIMES;
  const previous = info?.previousServices || [];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-900 via-secondary-700 to-accent-800 text-white py-10 md:py-14">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-gold-200 mb-3">Broadcast Chapel</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">Live Stream</h1>
              <p className="text-lg md:text-xl">Join us for live worship and the Word</p>
            </div>
            <div className="flex flex-row md:flex-col gap-3">
              {isLive && (
                <div className="flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-full animate-pulse justify-center">
                  <FaCircle className="text-sm" />
                  <span className="font-bold">LIVE NOW</span>
                </div>
              )}
              <a
                href={channel}
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
                {isLive ? (
                  <div>
                    <div className="aspect-video w-full">
                      <iframe
                        className="w-full h-full"
                        src={toEmbedUrl(info?.liveStreamUrl || '')}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Church Live Stream"
                      ></iframe>
                    </div>
                    <div className="p-5 md:p-6 text-white bg-gradient-to-r from-gray-900 to-primary-950">
                      <h2 className="text-xl md:text-2xl font-bold">{info?.currentService?.title || 'Live Service'}</h2>
                      {info?.currentService?.description && (
                        <p className="text-gray-300 mt-1">{info.currentService.description}</p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-4 text-sm">
                        <a href={info?.liveStreamUrl || channel} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 font-semibold hover:bg-red-700">
                          <FaYoutube /> Open on YouTube
                        </a>
                        <a href={facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700">
                          <FaFacebook /> Watch on Facebook
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-[360px] md:min-h-[520px] px-6 py-12 flex flex-col items-center justify-center text-center text-white bg-gradient-to-b from-gray-800 to-black">
                    <FaPlay className="text-6xl md:text-8xl mb-6 text-gray-600" />
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">We're not live right now</h2>
                    <p className="text-lg text-gray-400 mb-8 max-w-xl">
                      This page switches on by itself as soon as the service starts. Check the service times below, or catch up on past messages.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a href={channel} target="_blank" rel="noopener noreferrer" className="btn-primary">
                        Visit YouTube Channel
                      </a>
                      <Link to="/sermons" className="btn-secondary">
                        Past Sermons
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
                  <div className="grid sm:grid-cols-2 gap-4">
                    {times.map((service, index) => (
                      <div key={index} className="border-l-4 border-primary-600 pl-4 py-2">
                        <p className="font-bold text-lg text-gray-900">{service.title}</p>
                        <p className="text-primary-600 font-semibold">{service.time}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="editorial-card p-6 bg-primary-50/90 border border-primary-100/80">
                  <h3 className="text-xl font-bold mb-4">Where we stream</h3>
                  <p className="text-gray-600 mb-4">
                    Services are streamed live on YouTube and Facebook, and they play right here on this page.
                  </p>
                  <div className="flex flex-col gap-2 text-sm font-semibold">
                    <a href={channel} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-red-600 hover:underline">
                      <FaYoutube /> YouTube channel
                    </a>
                    <a href={facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-700 hover:underline">
                      <FaFacebook /> Facebook page
                    </a>
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
          <h2 className="text-3xl font-bold text-white mb-8">Recent Messages</h2>
          {previous.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {previous.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/15 hover:border-white/35 hover:shadow-2xl transition-all"
                >
                  <BrandImage src={getAssetUrl(item.imageUrl)} alt={item.title} label={item.preacher} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                    <p className="text-gray-400 mb-4 text-sm">
                      {item.preacher && `${item.preacher} • `}
                      {new Date(item.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {item.videoUrl ? (
                      <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full inline-flex items-center justify-center gap-2">
                        <FaPlay /> Watch
                      </a>
                    ) : (
                      <Link to="/sermons" className="btn-primary w-full inline-flex items-center justify-center gap-2">
                        <FaHeadphones /> Listen
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">Messages will appear here after each service.</p>
              <a href={channel} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
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
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <FaYoutube className="text-7xl md:text-8xl mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Never Miss a Service</h2>
            <p className="text-xl mb-2 opacity-90">
              Subscribe to our YouTube channel to get notified when we go live
            </p>
            <p className="text-lg mb-8 opacity-75">
              Watch past sermons, prayer sessions, and ministry updates anytime
            </p>
            <a
              href={channel}
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
