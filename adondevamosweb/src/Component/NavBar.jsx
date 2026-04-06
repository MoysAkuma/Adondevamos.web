// Navbar.jsx
import { useState, useEffect } from 'react';
import '../Css/navbar.css';

import { useAuth } from '../context/AuthContext';
import { useNavbarConfig } from '../hooks/useNavbarConfig';

export default function NavBar() {
  //evaluate session
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {logout, isLogged, role} = useAuth();
  
  // Get navbar configuration based on user role
  const { brand, menuItems, authButton, settings } = useNavbarConfig(role, isLogged);

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
          <a href={brand.href}>{brand.name}</a>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className={`hamburger ${isOpen ? 'open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        
        {/* Navigation links */}
        <nav className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <a href={item.href} onClick={closeMenu}>
                  {settings.showIcons && item.icon && (
                    <span className="menu-icon" aria-hidden="true">{item.icon}</span>
                  )}
                  <span className="menu-text">{item.title}</span>
                </a>
              </li>
            ))}
            
            {/* Auth button */}
            {authButton && (
              <li>
                {authButton.action === 'logout' ? (
                  <button onClick={() => logout()}>
                    {settings.showIcons && authButton.icon && (
                      <span className="button-icon" aria-hidden="true">{authButton.icon}</span>
                    )}
                    <span className="button-text">{authButton.title}</span>
                  </button>
                ) : (
                  <a href={authButton.href} onClick={closeMenu}>
                    {settings.showIcons && authButton.icon && (
                      <span className="menu-icon" aria-hidden="true">{authButton.icon}</span>
                    )}
                    <span className="menu-text">{authButton.title}</span>
                  </a>
                )}
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}