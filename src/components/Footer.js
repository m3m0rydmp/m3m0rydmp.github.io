import React from 'react';
import config from '../config';
import './Footer.css';

function Footer() {
  const getIconPath = (iconName) => {
    const iconMap = {
      github: '/icons/github.png',
      linkedin: '/icons/linkedin.png',
      hackthebox: '/icons/htb.jpeg',
      tryhackme: '/icons/THM.png'
    };
    return iconMap[iconName] || '/icons/github.png';
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>{config.footer.copyrightText}</p>
        
        <div className="social-links">
          <a 
            href={config.socialLinks.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-button"
            title="GitHub"
          >
            <img src={getIconPath('github')} alt="GitHub" className="social-icon" />
            <span className="social-label">GitHub</span>
          </a>

          <a 
            href={config.socialLinks.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-button"
            title="LinkedIn"
          >
            <img src={getIconPath('linkedin')} alt="LinkedIn" className="social-icon" />
            <span className="social-label">LinkedIn</span>
          </a>

          <a 
            href={config.socialLinks.hackthebox} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-button"
            title="HackTheBox"
          >
            <img src={getIconPath('hackthebox')} alt="HackTheBox" className="social-icon" />
            <span className="social-label">HTB</span>
          </a>

          <a 
            href={config.socialLinks.tryhackme} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-button"
            title="TryHackMe"
          >
            <img src={getIconPath('tryhackme')} alt="TryHackMe" className="social-icon" />
            <span className="social-label">THM</span>
          </a>
        </div>
      </div>

      <div className="terminal-cursor">▮</div>
    </footer>
  );
}

export default Footer;
