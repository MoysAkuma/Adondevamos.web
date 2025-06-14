// Navbar.jsx
import { useState, useEffect } from 'react';
import '../Css/navbar.css';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close menu when clicking on a link
  const closeMenu = () => setIsOpen(false);

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
            <li><a href="/CreateTrip" onClick={closeMenu}>Trips</a></li>
            <li><a href="/CreatePlace" onClick={closeMenu}>Places</a></li>
            <li><a href="/CreateUser" onClick={closeMenu}>User</a></li>
            <li><a href="/ManageSite" onClick={closeMenu}>Site Admin</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}