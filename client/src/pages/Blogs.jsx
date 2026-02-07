import { useState, useEffect, useContext } from 'react';
import { FaPenNib, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getUserBlogs, deleteBlog } from '../services/blogService';
import { AuthContext } from '../context/AuthContext';
import BlogForm from '../components/BlogForm';
import '../styles/ListPage.css';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await getUserBlogs();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id);
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchBlogs();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="list-page">
      <div className="container">
        <div className="page-header">
          <div>
            <FaPenNib className="page-icon" />
            <h1>My Travel Blogs</h1>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <FaPlus /> Write Blog
          </button>
        </div>

        {showForm && (
          <BlogForm
            item={editingItem}
            onClose={handleFormClose}
            onSuccess={handleFormClose}
          />
        )}

        {blogs.length === 0 ? (
          <div className="empty-state">
            <FaPenNib className="empty-icon" />
            <p>No blogs yet. Share your first travel experience!</p>
          </div>
        ) : (
          <div className="items-grid">
            {blogs.map((item) => (
              <div key={item._id} className="item-card blog-card">
                <div className="item-header">
                  <h3>{item.title}</h3>
                  <div className="item-actions">
                    <button onClick={() => handleEdit(item)} className="btn-icon">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="btn-icon btn-icon-danger">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="item-details">
                  <p className="blog-destination">📍 {item.destination}</p>
                  <p className="blog-content">{item.content}</p>
                  {item.tags?.length > 0 && (
                    <div className="blog-tags">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  <p className="blog-meta">Published: {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;

