import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SplashScreen.css';
import config from '../config';

const FADE_DURATION_MS = 500;

const SplashScreen = ({ onComplete }) => {
  const [fading, setFading] = useState(false);
  const [loadingText, setLoadingText] = useState('Initializing runtime environment');
  const [progress, setProgress] = useState(0);
  const skippedRef = useRef(false);
  const timersRef = useRef([]);

  const finish = useCallback(() => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
    setFading(true);
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, FADE_DURATION_MS);
    timersRef.current.push(completeTimer);
  }, [onComplete]);

  useEffect(() => {
    // Sequence of loading texts
    const statuses = [
      'Establishing secure connection...',
      'Bypassing mainframe protocols...',
      'Decrypting core assets...',
      'Access granted.'
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < statuses.length) {
        setLoadingText(statuses[step]);
        setProgress(Math.min(100, (step + 1) * 25));
        step++;
      }
    }, 500);

    // Start fade out after 2.5s
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2500);

    // Completely remove splash screen from DOM after fade out completes
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000); // 2500 timeout + 500ms fade transition length

    timersRef.current.push(fadeTimer, completeTimer);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Skippable: any click or keypress finishes the splash immediately.
  useEffect(() => {
    const handleKeyDown = () => finish();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [finish]);

  return (
    <div
      className={`splash-screen ${fading ? 'fade-out' : ''}`}
      onClick={finish}
      role="button"
      tabIndex={0}
      aria-label="Skip intro"
    >
      <div className="splash-grid" aria-hidden="true"></div>
      <div className="splash-glitch-rects" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index}></span>
        ))}
      </div>
      <div className="splash-content">
        <div className="splash-logo">{config.hero.mainTitle || 'm3m0rydmp'}</div>
        <div className="splash-text">{loadingText}</div>
        <div className="splash-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }}></span>
        </div>
        <div className="splash-pips" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <button
          type="button"
          className="splash-skip"
          onClick={(e) => {
            e.stopPropagation();
            finish();
          }}
        >
          [ SKIP ]
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
