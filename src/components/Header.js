import React, { useState } from 'react';
import config from '../config';
import './Header.css';

function Header({ activeSection, setActiveSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <span className="bracket">[</span>
          <span className="brand">{config.siteName}</span>
          <span className="bracket">]</span>
        </div>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          {config.navigation.links.map((link) => (
            <li key={link.name}>
              <a 
                href={link.href} 
                className={`nav-link ${activeSection === link.name.toLowerCase() ? 'active' : ''}`}
                onClick={() => handleNavClick(link.name.toLowerCase())}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <div 
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </header>
  );
}

export default Header;
