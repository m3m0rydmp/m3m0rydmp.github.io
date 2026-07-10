import React, { useState, useEffect, useMemo, useRef } from 'react';
import config from '../config';
import './Hero.css';

function Hero({ triggerDecryption = false }) {
  const [displayText, setDisplayText] = useState('');
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [titleText, setTitleText] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const hasDecrypted = useRef(false);
  const heroRef = useRef(null);

  // Pause the always-on glitch/cursor CSS animations while the hero is
  // scrolled out of view — they keep repainting layered pseudo-elements
  // even when nothing is visible.
  useEffect(() => {
    const node = heroRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const taglines = useMemo(() => config.taglines || [config.tagline || ''], []);
  const currentTagline = taglines[currentTaglineIndex];
  const mainTitle = config.hero.mainTitle;

  const profileImageCandidates = useMemo(() => {
    const configuredPath = config.profile.profilePicture || '/images/profile';
    const hasExtension = /\.[a-z0-9]+$/i.test(configuredPath);
    const candidates = hasExtension
      ? [configuredPath, '/images/profile.png', '/images/profile.webp', '/images/profile.jpg']
      : [
        `${configuredPath}.png`,
        `${configuredPath}.webp`,
        `${configuredPath}.jpg`,
        configuredPath,
        '/images/profile.png',
        '/images/profile.webp',
        '/images/profile.jpg'
      ];

    return [...new Set(candidates)];
  }, []);

  const [profileImageIndex, setProfileImageIndex] = useState(0);

  // Decryption animation on first load or when triggered by video end
  useEffect(() => {
    // Skip if already decrypted and not being re-triggered
    if (hasDecrypted.current && !triggerDecryption) return;

    // If triggered from video, reset the flag
    if (triggerDecryption) {
      hasDecrypted.current = false;
    }

    setIsDecrypting(true);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let iteration = 0;
    const speed = 30; // ms per frame

    const decrypt = () => {
      setTitleText(prevText => {
        return mainTitle.split('').map((char, index) => {
          if (index < iteration) {
            return mainTitle[index];
          }
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
      });

      iteration += 1 / 3; // Slower reveal

      if (iteration < mainTitle.length) {
        setTimeout(decrypt, speed);
      } else {
        setIsDecrypting(false);
        hasDecrypted.current = true;
      }
    };

    decrypt();
  }, [mainTitle, triggerDecryption]);

  // Tagline typing effect

  useEffect(() => {
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



  const handleButtonClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.offsetTop; // Use offsetTop for consistent behavior
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className={`hero ${isInView ? 'in-view' : ''}`} ref={heroRef}>
      <div className="hero-content">
        {isDecrypting ? (
          <h1 className="title-decrypting">
            {titleText || mainTitle}
          </h1>
        ) : (
          <h1 className="glitch layers" data-text={mainTitle}>
            <span>{mainTitle}</span>
          </h1>
        )}

        <p className="subtitle">
          <span className="cursor"></span>
          <span className="typing-text">{displayText}</span>
        </p>

        <p className="description">{config.description}</p>

        <div className="cta-buttons">
          <a
            href="#writeups"
            className="btn btn-primary"
            onClick={(e) => handleButtonClick(e, 'writeups')}
          >
            {config.hero.primaryButtonText}
          </a>
          <a
            href="#about"
            className="btn btn-secondary"
            onClick={(e) => handleButtonClick(e, 'about')}
          >
            {config.hero.secondaryButtonText}
          </a>
        </div>
      </div>

      <div className="hero-profile">
        <div className="profile-picture-container">
          <img
            src={profileImageCandidates[profileImageIndex]}
            alt={config.profile.profileAlt}
            className="profile-picture"
            onError={() => {
              if (profileImageIndex < profileImageCandidates.length - 1) {
                setProfileImageIndex((prev) => prev + 1);
              }
            }}
          />
          <span className="profile-credit" aria-hidden="true">Art by _chocosmonaught_</span>
        </div>

      </div>
    </section>
  );
}

export default Hero;
