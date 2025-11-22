import React, { useEffect } from 'react';
import config from '../config';
import './Header.css';

function Header({ activeSection, setActiveSection }) {
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

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <span className="bracket">[</span>
          <span className="brand">{config.siteName}</span>
          <span className="bracket">]</span>
        </div>

        <ul className="nav-links">
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
      </nav>
    </header>
  );
}

export default Header;
