import { useState } from 'react';
import { FaPlay, FaCircle, FaUsers } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LiveStream = () => {
  // SETUP INSTRUCTIONS:
  // 1. Stream from OBS Studio to YouTube Live
  // 2. Replace the URL below with your YouTube Live stream URL
  // 3. Set isLive to true when you're broadcasting
  // 4. For production, you can create an admin toggle or API to control this
  
  const [isLive,] = useState(false); // Change to true when streaming
  const liveStreamUrl = 'https://www.youtube.com/watch?v=YOUR_STREAM_ID'; // Replace with your YouTube Live URL
  
  // Alternative: Use YouTube Channel Live URL (always shows current live stream if any)
  // const liveStreamUrl = 'https://www.youtube.com/channel/YOUR_CHANNEL_ID/live';

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Live Stream</h1>
              <p className="text-xl">Join us for live worship and the Word</p>
            </div>
            {isLive && (
              <div className="flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-full animate-pulse">
                <FaCircle className="text-sm" />
                <span className="font-bold">LIVE NOW</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Player */}
      <section className="py-8">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black rounded-xl overflow-hidden shadow-2xl"
          >
            {isLive ? (
              <ReactPlayer
                url={liveStreamUrl}
                width="100%"
                height="600px"
                playing
                controls
                config={{
                  youtube: {
                    playerVars: { autoplay: 1 }
                  }
                }}
              />
            ) : (
              <div className="h-[600px] flex flex-col items-center justify-center text-white">
                <FaPlay className="text-8xl mb-6 text-gray-600" />
                <h2 className="text-3xl font-bold mb-4">Stream is Offline</h2>
                <p className="text-xl text-gray-400 mb-8">
                  We're not live right now. Check our service times below.
                </p>
                <Link to="/sermons" className="btn-primary">
                  View Previous Services
                </Link>
              </div>
            )}
          </motion.div>

          {/* Live Chat / Viewer Count */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="card p-6 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">About Today's Service</h3>
              <p className="text-gray-600 mb-4">
                Join us for an inspiring time of worship, praise, and powerful Word from our senior pastor.
              </p>
              <div className="flex items-center space-x-4 text-gray-700">
                <div className="flex items-center space-x-2">
                  <FaUsers className="text-primary-600" />
                  <span>245 Watching</span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <span>Sunday Service</span>
              </div>
            </div>

            <div className="card p-6 bg-primary-50">
              <h3 className="text-xl font-bold mb-4">Live Service Times</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold">Sunday School</p>
                  <p className="text-gray-600">8:00 AM - 9:00 AM</p>
                </div>
                <div>
                  <p className="font-semibold">Sunday Service</p>
                  <p className="text-gray-600">9:00 AM - 11:00 AM</p>
                </div>
                <div>
                  <p className="font-semibold">Prayer Hour</p>
                  <p className="text-gray-600">Tuesday 6:00 PM - 7:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold">Bible Study</p>
                  <p className="text-gray-600">Thursday 6:00 PM - 7:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold">Monthly Vigil</p>
                  <p className="text-gray-600">Last Friday 11:00 PM - 4:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Previous Services */}
      <section className="py-12 bg-gray-800">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-white mb-8">Previous Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="card">
                <img
                  src={`https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400`}
                  alt="Service"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Sunday Service</h3>
                  <p className="text-gray-600 mb-4">January {21 - item}, 2026</p>
                  <Link to="/sermons" className="btn-primary w-full inline-block text-center">Watch Replay</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LiveStream;
