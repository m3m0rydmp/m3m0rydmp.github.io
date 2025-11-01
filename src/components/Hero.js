import React, { useState, useEffect } from 'react';
import config from '../config';
import './Hero.css';

function Hero() {
  const [displayText, setDisplayText] = useState('');
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [matrixChars, setMatrixChars] = useState([]);
  const taglines = config.taglines || [config.tagline || ''];
  const currentTagline = taglines[currentTaglineIndex];

  // ASCII characters for Matrix rain effect
  const asciiChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

  useEffect(() => {
    let index = 0;
    let charIndex = 0;
    const typingSpeed = 50; // ms per character
    const displayDuration = 2000; // ms to show complete text
    const delayBetweenLines = 500; // ms delay before next tagline

    const type = () => {
      if (charIndex < currentTagline.length) {
        setDisplayText(currentTagline.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(type, typingSpeed);
      } else {
        // Text fully typed, wait then move to next tagline
        setTimeout(() => {
          setDisplayText('');
          setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
        }, displayDuration + delayBetweenLines);
      }
    };

    type();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTagline, taglines]);

  useEffect(() => {
    const generateMatrixChar = () => {
      const randomChar = asciiChars[Math.floor(Math.random() * asciiChars.length)];
      const newChar = {
        id: Math.random(),
        char: randomChar,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2
      };
      setMatrixChars(prev => [...prev, newChar]);
      
      setTimeout(() => {
        setMatrixChars(prev => prev.filter(c => c.id !== newChar.id));
      }, (newChar.duration + newChar.delay) * 1000);
    };

    const matrixInterval = setInterval(generateMatrixChar, 100);
    return () => clearInterval(matrixInterval);
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1 className="glitch" data-text={config.hero.mainTitle}>
          {config.hero.mainTitle}
        </h1>
        
        <p className="subtitle">
          <span className="cursor"></span>
          <span className="typing-text">{displayText}</span>
        </p>

        <p className="description">{config.description}</p>

        <div className="cta-buttons">
          <a href="#writeups" className="btn btn-primary">
            {config.hero.primaryButtonText}
          </a>
          <a href="#about" className="btn btn-secondary">
            {config.hero.secondaryButtonText}
          </a>
        </div>
      </div>

      <div className="hero-profile">
        <div className="profile-picture-container">
          <img 
            src={config.profile.profilePicture} 
            alt={config.profile.profileAlt}
            className="profile-picture"
          />
        </div>
        <div className="grid-lines"></div>
        
        {/* Matrix Rain Effect */}
        <div className="matrix-rain">
          {matrixChars.map(item => (
            <div
              key={item.id}
              className="matrix-char"
              style={{
                left: `${item.left}%`,
                '--delay': `${item.delay}s`,
                '--duration': `${item.duration}s`
              }}
            >
              {item.char}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
