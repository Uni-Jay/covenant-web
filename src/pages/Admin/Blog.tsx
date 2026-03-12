import { useState, useEffect } from 'react';
import { blogAPI } from '../../utils/api';
import { BlogPost } from '../../types';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(currentPost).forEach(key => {
      if (currentPost[key as keyof BlogPost] && key !== 'id') {
        formData.append(key, currentPost[key as keyof BlogPost] as string);
      }
    });

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (currentPost.id) {
        await blogAPI.update(currentPost.id, formData);
        toast.success('Blog post updated successfully');
      } else {
        await blogAPI.create(formData);
        toast.success('Blog post created successfully');
      }
      setShowModal(false);
      setCurrentPost({});
      setImageFile(null);
      fetchPosts();
    } catch (error) {
      toast.error('Failed to save blog post');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogAPI.delete(id);
        toast.success('Blog post deleted successfully');
        fetchPosts();
      } catch (error) {
        toast.error('Failed to delete blog post');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading blog posts...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Blog</h1>
        <button 
          onClick={() => {
            setCurrentPost({});
            setImageFile(null);
            setShowModal(true);
          }} 
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus /> <span>New Post</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Author</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="px-6 py-4">{post.title}</td>
                <td className="px-6 py-4">{post.author}</td>
                <td className="px-6 py-4">{post.category}</td>
                <td className="px-6 py-4">{new Date(post.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setCurrentPost(post);
                        setShowModal(true);
                      }}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {posts.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center mt-6">
          <p className="text-gray-600">No blog posts yet. Click "New Post" to create one!</p>
        </div>
      )}
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">
              {currentPost.id ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={currentPost.title || ''}
                  onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                  required
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Author *</label>
                  <input
                    type="text"
                    value={currentPost.author || ''}
                    onChange={(e) => setCurrentPost({...currentPost, author: e.target.value})}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    value={currentPost.date || ''}
                    onChange={(e) => setCurrentPost({...currentPost, date: e.target.value})}
                    required
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={currentPost.category || ''}
                  onChange={(e) => setCurrentPost({...currentPost, category: e.target.value})}
                  required
                  className="input-field"
                >
                  <option value="">Select Category</option>
                  <option value="Devotional">Devotional</option>
                  <option value="Teaching">Teaching</option>
                  <option value="Testimony">Testimony</option>
                  <option value="Announcement">Announcement</option>
                  <option value="Event Recap">Event Recap</option>
                  <option value="Prayer">Prayer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Excerpt *</label>
                <textarea
                  value={currentPost.excerpt || ''}
                  onChange={(e) => setCurrentPost({...currentPost, excerpt: e.target.value})}
                  rows={2}
                  required
                  placeholder="Brief summary (shown in blog list)"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <textarea
                  value={currentPost.content || ''}
                  onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})}
                  rows={12}
                  required
                  placeholder="Full article content"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="input-field"
                />
                {currentPost.imageUrl && (
                  <p className="text-sm text-gray-500 mt-1">Current image: {currentPost.imageUrl}</p>
                )}
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {currentPost.id ? 'Update' : 'Publish'} Post
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setCurrentPost({});
                    setImageFile(null);
                  }}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
