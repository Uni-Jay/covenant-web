import { useEffect, useState } from 'react';
import { FaPlay, FaCircle, FaUsers } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { contentAPI } from '../utils/api';
import { toast } from 'react-toastify';

const LiveStream = () => {
  const [loading, setLoading] = useState(true);
  const [streamData, setStreamData] = useState<any>(null);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const response = await contentAPI.getLiveStream();
        setStreamData(response.data);
      } catch (error) {
        toast.error('Failed to load live stream data');
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, []);

  const isLive = streamData?.isLive || false;
  const liveStreamUrl = streamData?.liveStreamUrl;

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
                    {streamData?.currentService?.description}
                  </p>
                  <div className="flex items-center space-x-4 text-gray-700">
                    <div className="flex items-center space-x-2">
                      <FaUsers className="text-primary-600" />
                      <span>{streamData?.currentService?.viewers || 0} Watching</span>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <span>{streamData?.currentService?.title}</span>
                  </div>
                </div>

                <div className="card p-6 bg-primary-50">
                  <h3 className="text-xl font-bold mb-4">Live Service Times</h3>
                  <div className="space-y-3 text-sm">
                    {streamData?.serviceTimes?.map((service: any) => (
                      <div key={service.title}>
                        <p className="font-semibold">{service.title}</p>
                        <p className="text-gray-600">{service.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Previous Services */}
      <section className="py-12 bg-gray-800">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-white mb-8">Previous Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {streamData?.previousServices?.map((item: any) => (
              <div key={item.id} className="card">
                <img
                  src={item.imageUrl}
                  alt="Service"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{new Date(item.date).toLocaleDateString()}</p>
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
