import React, { useEffect, useMemo, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ErrorPage from './components/ErrorPage';
import LetterGlitch from './components/LetterGlitch';
import IntroVideo from './components/IntroVideo';
import WriteupDrawer from './components/WriteupDrawer';
import './components/WriteupPage.css';
import './App.css';

// Lazy load heavy components
const Writeups = lazy(() => import('./components/Writeups'));
const Projects = lazy(() => import('./components/Projects'));
const About = lazy(() => import('./components/About'));
const WriteupDetail = lazy(() => import('./components/WriteupDetail'));
const PlatformCategory = lazy(() => import('./components/PlatformCategory'));

// Loading fallback
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    color: 'var(--primary-cyan)',
    fontFamily: 'var(--font-family)'
  }}>
    Decrypting...
  </div>
);

// Main home page component
function HomePage({ activeSection, setActiveSection }) {
  const [triggerDecryption, setTriggerDecryption] = useState(false);

  const handleIntroComplete = () => {
    setTriggerDecryption(true);
  };

  return (
    <>
      {/* Intro Video Component */}
      <IntroVideo onIntroComplete={handleIntroComplete} />

      {/* Full page letter glitch background */}
      <div className="letter-glitch-background">
        <LetterGlitch
          glitchColors={['#0a0e27', '#54c1e6', '#1a1a2e']}
          glitchSpeed={80}
          centerVignette={false}
          outerVignette={false}
          smooth={true}
        />
      </div>

      <div className="terminal-frame">
        <Header activeSection={activeSection} setActiveSection={setActiveSection} />
        <main>
          <Hero triggerDecryption={triggerDecryption} />
          <Suspense fallback={<PageLoader />}>
            <Writeups />
            <Projects />
            <About />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}

function WriteupPage({ activeSection, setActiveSection }) {
  useEffect(() => {
    setActiveSection('writeups');
  }, [setActiveSection]);

  const initialDrawerState = useMemo(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    return window.innerWidth > 1024;
  }, []);

  const [drawerOpen, setDrawerOpen] = useState(initialDrawerState);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <>
      <div className="letter-glitch-background">
        <LetterGlitch
          glitchColors={['#0a0e27', '#54c1e6', '#1a1a2e']}
          glitchSpeed={80}
          centerVignette={false}
          outerVignette={false}
          smooth={true}
        />
      </div>

      <div className={`writeup-shell ${drawerOpen ? 'drawer-open' : 'drawer-collapsed'}`}>
        <WriteupDrawer isOpen={drawerOpen} onToggle={toggleDrawer} />
        <div
          className="drawer-overlay"
          aria-hidden="true"
          onClick={drawerOpen ? toggleDrawer : undefined}
        ></div>
        <button
          type="button"
          className="drawer-floating-toggle"
          aria-label={drawerOpen ? 'Hide sidebar' : 'Show sidebar'}
          aria-expanded={drawerOpen}
          data-state={drawerOpen ? 'open' : 'closed'}
          onClick={toggleDrawer}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="writeup-content">
          <div className="writeup-content-inner">
            <Suspense fallback={<PageLoader />}>
              <WriteupDetail />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <Router>
      <Helmet>
        <title>m3m0rydmp | Cyberpunk Portfolio</title>
        <meta name="description" content="Cybersecurity portfolio and writeups showcase featuring CTF solutions, pentesting reports, and security research." />
      </Helmet>
      <Routes>
        {/* Main home page */}
        <Route
          path="/"
          element={<HomePage activeSection={activeSection} setActiveSection={setActiveSection} />}
        />

        <Route
          path="/writeups/:slug"
          element={<WriteupPage activeSection={activeSection} setActiveSection={setActiveSection} />}
        />

        <Route
          path="/writeups/platform/:platform"
          element={
            <Suspense fallback={<PageLoader />}>
              <PlatformCategory />
            </Suspense>
          }
        />

        {/* Error pages */}
        <Route path="/404" element={<ErrorPage statusCode={404} />} />
        <Route path="/403" element={<ErrorPage statusCode={403} />} />
        <Route path="/500" element={<ErrorPage statusCode={500} />} />
        <Route path="/502" element={<ErrorPage statusCode={500} />} />
        <Route path="/503" element={<ErrorPage statusCode={500} />} />

        {/* Catch all other routes and show 404 */}
        <Route path="*" element={<ErrorPage statusCode={404} />} />
      </Routes>
    </Router>
  );
}

export default App;
