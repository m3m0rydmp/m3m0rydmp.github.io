import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ArrowLeft } from 'lucide-react';
import config from '../config';
import writeupsData from '../data/writeupsData.json';
import './WriteupDrawer.css';

function WriteupDrawer({ isOpen = true, onToggle = () => {}, showToggle = true, className = '' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navLinks = config.navigation.links ?? [];
  const profileImage = config.profile.profilePicture;
  const socialLinks = config.socialLinks ?? {};

  const isWriteupDetailPage = location.pathname.startsWith('/writeups/') && 
                               !location.pathname.startsWith('/writeups/platform/');

  const currentPlatform = React.useMemo(() => {
    if (!isWriteupDetailPage) return null;
    
    const pathParts = location.pathname.split('/');
    const slug = pathParts[pathParts.length - 1];
    const writeup = writeupsData.items?.find(item => item.slug === slug);
    
    if (writeup && writeup.platform) {
      return writeup.platform.toLowerCase().replace(/[^a-z0-9]/g, '');
    }
    return null;
  }, [location.pathname, isWriteupDetailPage]);

  const handleBackToPlatform = (e) => {
    e.preventDefault();
    if (currentPlatform) {
      navigate(`/writeups/platform/${currentPlatform}`);
    }
  };

  const getIconPath = (iconName) => {
    const iconMap = {
      github: '/icons/github.png',
      linkedin: '/icons/linkedin.png',
      hackthebox: '/icons/htb.jpeg',
      tryhackme: '/icons/THM.png',
      resetsec: '/icons/resetsec.webp',
      pwndesal: '/icons/pwndesal.jpg'
    };
    return iconMap[iconName] || '/icons/github.png';
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    
    navigate('/');
    
    setTimeout(() => {
      if (href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.offsetTop;
          const offsetPosition = elementPosition - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }, 100);
  };

  const drawerClassName = ['writeup-drawer', isOpen ? 'open' : 'collapsed', className]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={drawerClassName}>
      <div className="drawer-top">
        <div className="drawer-profile">
          {profileImage && (
            <img src={profileImage} alt={`${config.profile.name} avatar`} loading="lazy" />
          )}
          <p className="drawer-name">{config.profile.name}</p>
        </div>
        {showToggle && (
          <button
            type="button"
            className="drawer-toggle"
            onClick={onToggle}
            aria-label={isOpen ? 'Hide sidebar' : 'Show sidebar'}
            aria-expanded={isOpen}
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      <nav className="drawer-nav" aria-label="Primary">
        {isWriteupDetailPage && currentPlatform && (
          <a 
            href="#back"
            onClick={handleBackToPlatform}
            className="drawer-back-button"
          >
            <ArrowLeft size={16} />
            <span>Writeup List</span>
          </a>
        )}
        {navLinks.map((link) => (
          <a 
            key={link.name} 
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
          >
            {link.name}
          </a>
        ))}
      </nav>

      <div className="drawer-footer">
        <div className="drawer-socials" aria-label="Social links">
          {Object.entries(socialLinks).map(([key, value]) => (
            value ? (
              <a key={key} href={value} target="_blank" rel="noopener noreferrer" title={key}>
                <img src={getIconPath(key)} alt={`${key} icon`} />
              </a>
            ) : null
          ))}
        </div>
        <p className="drawer-handle">Hack The Box writeups</p>
      </div>
    </aside>
  );
}

export default WriteupDrawer;
