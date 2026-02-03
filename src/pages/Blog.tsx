import { useState, useEffect } from 'react';
import { blogAPI } from '../utils/api';
import { BlogPost } from '../types';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaUser, FaCalendar, FaArrowRight } from 'react-icons/fa';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await blogAPI.getAll();
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-4">Blog & News</h1>
          <p className="text-xl">Stay updated with the latest from our church</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="spinner"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl">No blog posts yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card group"
                >
                  <div className="overflow-hidden">
                    <img
                      src={post.imageUrl ? `http://localhost:5000${post.imageUrl}` : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs bg-primary-100 text-primary-600 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold mt-3 mb-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <FaUser />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaCalendar />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="text-primary-600 font-semibold flex items-center space-x-2 hover:underline">
                      <span>Read More</span>
                      <FaArrowRight />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
