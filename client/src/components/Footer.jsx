import { Link } from 'react-router-dom';
import { FaInstagram, FaGithub, FaTwitter, FaMapMarkedAlt } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">

        {/* Brand */}
        <div className="footer-brand">
          <h2>Trekkers Heaven</h2>
          <p>Your companion for planning unforgettable journeys around the world.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/Dashboard">Dashboard</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/login">Login</Link>
        </div>

        {/* Features */}
        <div className="footer-links">
          <h4>Features</h4>
          <span>Itinerary Planning</span>
          <span>Expense Tracking</span>
          <span>Flights & Stays</span>
          <span>Travel Blogs</span>
        </div>

        {/* Social */}
        <div className="footer-social">
          <h4>Connect</h4>
          <div className="social-icons">
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="GitHub"><FaGithub /></a>
            <a href="#" aria-label="Map"><FaMapMarkedAlt /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Trekkers Heaven. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
