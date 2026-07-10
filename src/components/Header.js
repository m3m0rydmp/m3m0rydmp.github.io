import React, { useEffect, useState } from 'react';
import config from '../config';
import SearchBar from './SearchBar';
import './Header.css';

function Header({ activeSection, setActiveSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on Escape and prevent body scroll while it's open.
  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  // Scroll spy - detect which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'writeups', 'projects', 'about'];
      const scrollPosition = window.scrollY + 150; // Detection point in viewport

      // Check sections in reverse order (bottom to top)
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          return;
        }
      }

      // Default to home if at very top
      setActiveSection('home');
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
        const elementPosition = element.offsetTop; // Use offsetTop instead of getBoundingClientRect
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setActiveSection(targetId);
      }
    }
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <span className="bracket">[</span>
          <span className="brand">{config.siteName}</span>
          <span className="bracket">]</span>
        </div>

        <button
          type="button"
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-nav-links"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="nav-controls">
          <ul id="primary-nav-links" className={`nav-links ${menuOpen ? 'active' : ''}`}>
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

          <SearchBar customClass="header-search" />
        </div>
      </nav>
    </header>
  );
}

export default Header;
