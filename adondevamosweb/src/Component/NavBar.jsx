// Navbar.jsx
import { useState, useEffect } from 'react';
import '../Css/navbar.css';

import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  //evaluate session
  const { user, checkAuthStatus } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  // Close menu when clicking on a link
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
      closeMenu();
  }

  // Track scroll for navbar styling
  useEffect(() => { 
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <a href="/">A donde vamos</a>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className={`hamburger ${isOpen ? 'open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        {/* Navigation links */}
        <nav className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="/" onClick={closeMenu}>Home</a></li>
          {
            checkAuthStatus() ? 
              (<>
                <li><a href="/CreateTrip" onClick={closeMenu}>Trips</a></li>
                <li><a href="/CreatePlace" onClick={closeMenu}>Places</a></li>                
                <li><a href="/ManageSite" onClick={closeMenu}>Site Admin</a></li>
                <li><a href='' onClick={handleLogout} >Logout</a> </li>
              </>
              ) : 
              (<>
                <li><a href="/login" onClick={closeMenu}>Login</a></li>
              </>)
          }
          </ul>
        </nav>
      </div>
    </header>
  );
}