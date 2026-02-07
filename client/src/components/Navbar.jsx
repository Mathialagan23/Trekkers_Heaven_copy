import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Brand */}
          <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            Trekkers Heaven
          </Link>

          {/* Mobile toggle */}
          <button
            className="navbar-toggle"
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>

          {/* Links */}
          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/blogs" onClick={() => setMenuOpen(false)}>My Blogs</Link>
                <span className="navbar-user">Welcome, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-small">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  <button className="btn btn-primary btn-small">Sign Up</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


// import { Link, useNavigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import '../styles/Navbar.css';

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <nav className="navbar">
//       <div className="container">
//         <div className="navbar-content">
//           <Link to="/" className="navbar-brand">
//             {/* <span className="brand-icon">🌲</span> */}
//             Trekkers Heaven
//           </Link>
          
//           <div className="navbar-links">
//             {user ? (
//               <>
//                 <Link to="/dashboard">Dashboard</Link>
//                 <Link to="/blogs">My Blogs</Link>
//                 <span className="navbar-user">Welcome, {user.name}</span>
//                 <button onClick={handleLogout} className="btn btn-outline btn-small">
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login">Login</Link>
//                 <Link to="/register">
//                   <button className="btn btn-primary btn-small">Sign Up</button>
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

