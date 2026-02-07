import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicBlogs } from '../services/blogService';
import { FaMapMarkedAlt, FaPenNib } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Track touch start Y for touch scrolling
  const touchStartRef = useRef(0);

  // Refs to content elements and their native handlers (used to attach non-passive listeners)
  const contentRefs = useRef({});
  const contentHandlers = useRef({});

  const handleWheelOnContent = (e) => {
    const el = e.currentTarget;
    // If content not scrollable, allow page scroll
    if (el.scrollHeight <= el.clientHeight) return;
    const delta = e.deltaY;
    const atTop = el.scrollTop === 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    // If at edge and scrolling outwards, let the page handle it
    if ((delta < 0 && atTop) || (delta > 0 && atBottom)) return;
    // Otherwise prevent the page from scrolling while inside the content area
    e.stopPropagation();
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches ? e.touches[0].clientY : e.clientY;
  };

  const handleTouchMove = (e) => {
    const el = e.currentTarget;
    if (el.scrollHeight <= el.clientHeight) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = touchStartRef.current - currentY;
    const atTop = el.scrollTop === 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    if ((delta < 0 && atTop) || (delta > 0 && atBottom)) return;
    e.stopPropagation();
  };

  const destinations = [
    {
      name: 'Santorini, Greece',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop',
      description: 'Stunning sunsets and white-washed buildings'
    },
    {
      name: 'Machu Picchu, Peru',
      image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=600&fit=crop',
      description: 'Ancient Incan citadel in the Andes'
    },
    {
      name: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=600&fit=crop',
      description: 'Tropical paradise with rich culture'
    },
    {
      name: 'Kyoto, Japan',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
      description: 'Traditional temples and cherry blossoms'
    },
    {
      name: 'Kyoto, Japan',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
      description: 'Traditional temples and cherry blossoms'
    },
    {
      name: 'Kyoto, Japan',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
      description: 'Traditional temples and cherry blossoms'
    }
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getPublicBlogs();
        setBlogs(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleAction = () => {
    navigate('/login');
  };

  // Attach native non-passive wheel/touch listeners to content elements when expanded
  useEffect(() => {
    const attach = (id) => {
      const el = contentRefs.current[id];
      if (!el || contentHandlers.current[id]) return;

      const wheel = function (e) {
        // If content not scrollable, allow page scroll
        if (el.scrollHeight <= el.clientHeight) return;
        const delta = e.deltaY;
        const atTop = el.scrollTop === 0;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
        if ((delta < 0 && atTop) || (delta > 0 && atBottom)) return;
        e.preventDefault();
        e.stopPropagation();
      };

      const touchStart = function (e) {
        touchStartRef.current = e.touches ? e.touches[0].clientY : e.clientY;
      };

      const touchMove = function (e) {
        if (el.scrollHeight <= el.clientHeight) return;
        const currentY = e.touches ? e.touches[0].clientY : e.clientY;
        const delta = touchStartRef.current - currentY;
        const atTop = el.scrollTop === 0;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
        if ((delta < 0 && atTop) || (delta > 0 && atBottom)) return;
        e.preventDefault();
        e.stopPropagation();
      };

      el.addEventListener('wheel', wheel, { passive: false });
      el.addEventListener('touchstart', touchStart, { passive: true });
      el.addEventListener('touchmove', touchMove, { passive: false });

      contentHandlers.current[id] = { wheel, touchStart, touchMove };
    };

    const detach = (id) => {
      const el = contentRefs.current[id];
      const h = contentHandlers.current[id];
      if (!el || !h) return;
      el.removeEventListener('wheel', h.wheel);
      el.removeEventListener('touchstart', h.touchStart);
      el.removeEventListener('touchmove', h.touchMove);
      delete contentHandlers.current[id];
    };

    blogs.forEach((b) => {
      const id = b._id;
      if (expanded[id]) attach(id);
      else detach(id);
    });

    return () => {
      Object.keys(contentHandlers.current).forEach((id) => detach(id));
    };
  }, [expanded, blogs]);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1>Welcome to Trekkers Heaven</h1>
          <p>Plan your perfect adventure with our comprehensive travel tools</p>
          <button onClick={handleAction} className="btn btn-primary btn-large">
            Get Started
          </button>
        </div>
      </section>


      {/* DESTINATIONS */}
      <section className="destinations">
        <div className="container">
          <h2>Famous Travel Destinations</h2>
          <div className="destinations-grid">
            {destinations.map((dest, index) => (
              <div key={index} className="destination-card">
                <img src={dest.image} alt={dest.name} />
                <div className="destination-info">
                  <h3>{dest.name}</h3>
                  <p>{dest.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOGS */}
      <section className="blogs-section">
        <div className="container">
          <div className="section-header">
            <h2>Travel Blogs & Experiences</h2>
          </div>

          {loading ? (
            <div className="loading">Loading blogs...</div>
          ) : blogs.length > 0 ? (
            <div className="blogs-grid">
              {blogs.map((blog) => {
                const isExpanded = !!expanded[blog._id];
                const isLong = (blog.content || '').length > 150;

                return (
                  <div key={blog._id} className="blog-card">
                    <h3>{blog.title}</h3>
                    <p className="blog-destination">📍 {blog.destination}</p>

                    {/* Scrollable content */}
                    <div
                      ref={(el) => (contentRefs.current[blog._id] = el)}
                      className={`blog-content-wrapper ${isExpanded ? 'expanded' : ''}`}
                      tabIndex={isExpanded ? 0 : -1}
                      aria-expanded={isExpanded}
                      onWheel={isExpanded ? handleWheelOnContent : undefined}
                      onTouchStart={isExpanded ? handleTouchStart : undefined}
                      onTouchMove={isExpanded ? handleTouchMove : undefined}
                    >
                      <p className="blog-content">
                        {isExpanded || !isLong
                          ? blog.content
                          : `${blog.content.substring(0, 150)}...`}
                      </p>
                    </div>

                    {/* Meta always visible */}
                    <div className="blog-meta">
                      <span>By {blog.user?.name || 'Anonymous'}</span>
                      {isLong && (
                        <button
                          onClick={() => toggleExpand(blog._id)}
                          className="btn btn-outline btn-small"
                        >
                          {isExpanded ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-blogs">
              No blogs available yet. Be the first to share your experience!
            </p>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="container">
          <h2>Plan Your Perfect Trip</h2>
          <div className="features-grid">
            <div className="feature-card" onClick={handleAction}>
              <FaMapMarkedAlt className="feature-icon" />
              <h3>Itinerary Planning</h3>
              <p>Organize your trips with detailed itineraries</p>
            </div>
            <div className="feature-card" onClick={handleAction}>
              <FaPenNib className="feature-icon" />
              <h3>Travel Blogs</h3>
              <p>Share your adventures with the community</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
