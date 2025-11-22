import React, { useState, useEffect, useRef } from 'react';
import './IntroVideo.css';

const SESSION_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

const IntroVideo = ({ onIntroComplete }) => {
  const [showIntro, setShowIntro] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGlitchTransition, setShowGlitchTransition] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
  const [showUnmutePrompt, setShowUnmutePrompt] = useState(false);
  const [hideReplayButton, setHideReplayButton] = useState(false);
  const videoRef = useRef(null);
  const sessionKey = 'cyberpunk_intro_session';

  useEffect(() => {
    // Check if user should see intro
    const checkIntroStatus = () => {
      const sessionData = localStorage.getItem(sessionKey);
      
      if (!sessionData) {
        // First time visitor - show intro
        setShowIntro(true);
        setIsPlaying(true);
        setShowUnmutePrompt(true);
        createSession();
      } else {
        // Check if session is still valid
        const { timestamp } = JSON.parse(sessionData);
        const currentTime = Date.now();
        const timeDiff = currentTime - timestamp;
        
        if (timeDiff > SESSION_DURATION) {
          // Session expired - show intro again
          setShowIntro(true);
          setIsPlaying(true);
          setShowUnmutePrompt(true);
          createSession();
        }
      }
    };

    checkIntroStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createSession = () => {
    const sessionData = {
      timestamp: Date.now(),
      id: Math.random().toString(36).substring(2, 15)
    };
    localStorage.setItem(sessionKey, JSON.stringify(sessionData));
  };

  const updateSessionTimestamp = () => {
    const sessionData = localStorage.getItem(sessionKey);
    if (sessionData) {
      const data = JSON.parse(sessionData);
      data.timestamp = Date.now();
      localStorage.setItem(sessionKey, JSON.stringify(data));
    }
  };

  // Update session timestamp on user activity
  useEffect(() => {
    const handleActivity = () => {
      updateSessionTimestamp();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hide replay button when user is at footer
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('.footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const isAtFooter = footerRect.top < windowHeight && footerRect.bottom > 0;
        setHideReplayButton(isAtFooter);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleVideoEnd = () => {
    // Show glitch transition
    setShowGlitchTransition(true);
    
    // After glitch transition, hide everything and trigger hero decryption
    setTimeout(() => {
      setShowIntro(false);
      setIsPlaying(false);
      setShowGlitchTransition(false);
      if (onIntroComplete) {
        onIntroComplete();
      }
    }, 1000); // 1 second glitch transition
  };

  const handleSkip = () => {
    // Show glitch transition when skipping
    setShowGlitchTransition(true);
    
    setTimeout(() => {
      setShowIntro(false);
      setIsPlaying(false);
      setShowGlitchTransition(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (onIntroComplete) {
        onIntroComplete();
      }
    }, 1000);
  };

  const handleReplay = () => {
    setShowIntro(true);
    setIsPlaying(true);
    setIsMuted(false);
    setShowUnmutePrompt(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleUnmute = () => {
    setIsMuted(false);
    setShowUnmutePrompt(false);
    if (videoRef.current) {
      videoRef.current.muted = false;
    }
  };

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [isPlaying, isMuted]);

  return (
    <>
      {/* Intro Video Overlay */}
      {showIntro && (
        <div className={`intro-overlay ${showGlitchTransition ? 'glitch-out' : ''}`}>
          <video
            ref={videoRef}
            className="intro-video"
            onEnded={handleVideoEnd}
            playsInline
            muted={isMuted}
          >
            <source src="/videos/intro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {!showGlitchTransition && (
            <>
              <button className="skip-intro-btn" onClick={handleSkip}>
                <span className="skip-text">Skip Intro</span>
                <span className="skip-icon">»</span>
              </button>
              
              {showUnmutePrompt && isMuted && (
                <button className="unmute-btn" onClick={handleUnmute}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="22" y1="2" x2="2" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Click to Unmute</span>
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Replay Button (fixed position) */}
      {!showIntro && !hideReplayButton && (
        <button className="replay-intro-btn" onClick={handleReplay} title="Watch Intro Again">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5v14l11-7z" fill="currentColor"/>
          </svg>
          <span className="replay-text">Intro</span>
        </button>
      )}
    </>
  );
};

export default IntroVideo;
