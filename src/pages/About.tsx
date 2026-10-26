import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';
import { contentAPI, getAssetUrl } from '../utils/api';
import BrandImage from '../components/BrandImage';

export type AboutInfo = {
  pastorName: string;
  pastorRole: string;
  pastorPhoto: string;
  pastorMessage: string;
  leaders: { name: string; role: string; photo?: string }[];
};

const About = () => {
  const [about, setAbout] = useState<AboutInfo | null>(null);

  useEffect(() => {
    contentAPI.getAbout().then((r) => setAbout(r.data)).catch(() => {});
  }, []);

  const customMessage = about?.pastorMessage?.trim();
  const leaders = about?.leaders || [];

  return (
    <div className="page-shell">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="verse-kicker mb-5">Our Foundation</div>
            <h1 className="page-hero-title md:text-6xl">About Us</h1>
            <p className="text-xl italic text-gold-300">
              "Household of the living God" - 1 Timothy 3:15
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-white/70">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto editorial-card">
            <p className="text-xs uppercase tracking-[0.18em] text-accent-700 font-bold mb-3 text-center">Our Beginning</p>
            <h2 className="section-title text-center">Our Story</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Household Of Covenant And Faith Apostolic Ministry was founded with a divine vision to be a beacon of hope and light in our community. Located at 140, Obafemi Awolowo Road, Radio Bus stop, Ikorodu, Lagos Nigeria, our church has been a spiritual home for countless families seeking to grow in their faith and relationship with God.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Our name comes from the profound understanding that God's Word is His covenant with us - unchanging, faithful, and full of promises. As stated in 1 Timothy 3:15, we are the "household of the living God, the pillar and foundation of the truth." This scripture guides our mission and vision.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gradient-to-b from-primary-50/70 to-white/80">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="card p-8 border border-primary-100/80"
            >
              <h3 className="text-3xl font-bold mb-6 text-primary-600">Our Mission</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                To spread the gospel of Jesus Christ, nurture believers in their faith journey, and transform lives through the power of God's Word. We are committed to being a light in our community, demonstrating God's love through worship, fellowship, and service.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="card p-8 border border-primary-100/80"
            >
              <h3 className="text-3xl font-bold mb-6 text-primary-600">Our Vision</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                To be a thriving, Christ-centered church that impacts our city and beyond with the transformative message of the Gospel, raising disciples who will shine as lights in the world and fulfill God's purposes in their generation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white/70">
        <div className="container-custom">
          <h2 className="section-title text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Faith',
                description: 'We believe in the power of faith to move mountains and transform lives.',
              },
              {
                title: 'Love',
                description: 'We demonstrate God\'s unconditional love to all people.',
              },
              {
                title: 'Excellence',
                description: 'We pursue excellence in all we do as an offering to God.',
              },
              {
                title: 'Community',
                description: 'We value authentic relationships and meaningful fellowship.',
              },
              {
                title: 'Service',
                description: 'We serve God by serving others with humility and joy.',
              },
              {
                title: 'Growth',
                description: 'We are committed to continuous spiritual and personal growth.',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="editorial-card p-6 text-center"
              >
                <h3 className="text-xl font-bold mb-3 text-primary-600">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pastor's Message */}
      <section className="section-padding bg-gradient-to-b from-white/60 to-primary-50/70">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 md:p-12 border border-primary-100/80">
              <FaQuoteLeft className="text-5xl text-primary-600 mb-6" />
              <h2 className="text-3xl font-bold mb-6">Pastor's Message</h2>
              {customMessage ? (
                customMessage.split(/\n\s*\n/).map((para, i) => (
                  <p key={i} className="text-gray-700 text-lg leading-relaxed mb-6 whitespace-pre-line">{para}</p>
                ))
              ) : (
                <>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Welcome to Household Of Covenant And Faith Apostolic Ministry! It is my joy and privilege to shepherd this wonderful congregation. Our church is more than just a building - it's a family where you belong, a place where you can grow in your faith, and a community where you can make a difference.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                As we walk together in faith, I invite you to experience God's transforming love and discover the purpose He has for your life. Whether you're seeking answers, looking for hope, or wanting to deepen your relationship with Christ, you'll find a home here.
              </p>
                </>
              )}
              {about?.pastorName && (
                <div className="flex items-center space-x-4 mt-8">
                  <BrandImage
                    src={getAssetUrl(about.pastorPhoto)}
                    alt={about.pastorName}
                    className="w-20 h-20 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <p className="font-bold text-lg">{about.pastorName}</p>
                    {about.pastorRole && <p className="text-gray-600">{about.pastorRole}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team: filled in from Admin → Leadership */}
      {leaders.length > 0 && (
        <section className="section-padding bg-white/70">
          <div className="container-custom">
            <h2 className="section-title text-center mb-12">Our Leadership</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {leaders.map((leader, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card text-center border border-primary-100/80 overflow-hidden w-full sm:w-64"
                >
                  <BrandImage
                    src={getAssetUrl(leader.photo)}
                    alt={leader.name}
                    className="w-full aspect-square object-cover object-top"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{leader.name}</h3>
                    {leader.role && <p className="text-gray-600">{leader.role}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default About;
