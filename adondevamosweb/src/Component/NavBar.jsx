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
  const [isAdmin, setIsAdmin] = useState(false);
  const {logout} = useAuth();

  // Close menu when clicking on a link
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  }

  // Track scroll for navbar styling
  useEffect(() => { 
    const userid = localStorage.getItem('userid');
    if ( userid ) {
      setIsAuth(true);
    }

    const role = localStorage.getItem('role');
    if ( role ) {
      if(role.match("Admin")){
        setIsAdmin(true);
      }
      
    }
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
            isAuth 
            ? (
                isAdmin ? 
                (<>
                  <li><a href="/CreatePlace" onClick={closeMenu}>Add Places</a></li>                
                  <li><a href="/ManageSite" onClick={closeMenu}>Admin</a></li>
                  <li><a href="/CreateTrip" onClick={closeMenu}>Add Trip</a></li>
                  <li><a href="/Logout" onClick={handleLogout} >Logout</a> </li>
                </>) : 
                (<>
                  <li><a href="/CreateTrip" onClick={closeMenu}>Add Trip</a></li>
                  <li><a href="/Logout"  onClick={handleLogout} >Logout</a> </li>
                </>)
              ) 
               : 
              (<>
                <li><a href="/CreateUser" onClick={closeMenu}>Create an account</a></li>
                <li><a href="/login" onClick={closeMenu}>Login</a></li>
              </>)
          }
          </ul>
        </nav>
      </div>
    </header>
  );
}