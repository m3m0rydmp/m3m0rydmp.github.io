import React, { useState, useEffect } from 'react';
import config from '../config';
import './Header.css';

function Header({ activeSection, setActiveSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll spy - detect which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'writeups', 'projects', 'about'];
      const scrollPosition = window.scrollY + 80; // Match header offset

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveSection]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);

    if (href === '#home') {
      // Scroll to top for home button
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
    } else {
      const targetId = href.substring(1); // Remove #
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 80; // Height of fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setActiveSection(targetId);
      }
    }
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
          {config.navigation.links.map((link) => {
            const sectionId = link.href.substring(1); // Remove # from href
            return (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  className={`nav-link ${activeSection === sectionId ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </a>
              </li>
            );
          })}
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
