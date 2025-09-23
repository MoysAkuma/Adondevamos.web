// Navbar.jsx
import { useState, useEffect } from 'react';
import '../Css/navbar.css';

import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  //evaluate session
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {logout, isLogged, role} = useAuth();

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
          <a href="/">AdondeVamos</a>
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
            <li><a href="/Trips" onClick={closeMenu}>Trips</a></li>
            <li><a href="/Places" onClick={closeMenu}>Places</a></li>
          {
            isLogged 
            ? (
                role === "Admin" ? 
                (<>
                  <li><a href="/ManageSite" onClick={closeMenu}>Admin</a></li>
                  <li><button onClick={ () =>logout()}>Logout</button></li>
                </>) : 
                (<>
                  <li><button onClick={ () =>logout()}>Logout</button></li>
                </>)
              ) 
               : 
              (<>
                <li><a href="/CreateUser" onClick={closeMenu}>Create an account</a></li>
                <li><a href="/Login" onClick={closeMenu}>Login</a> </li>
              </>)
          }
          </ul>
        </nav>
      </div>
    </header>
  );
}