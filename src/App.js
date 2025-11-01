import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Writeups from './components/Writeups';
import Projects from './components/Projects';
import About from './components/About';
import Footer from './components/Footer';
import ErrorPage from './components/ErrorPage';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [errorCode, setErrorCode] = useState(null);

  useEffect(() => {
    // Check URL for error page routes (/404, /403, /50x)
    const path = window.location.pathname;
    if (path === '/404') {
      setErrorCode(404);
    } else if (path === '/403') {
      setErrorCode(403);
    } else if (path === '/50x') {
      setErrorCode(500);
    }
  }, []);

  // Show error page if error code is set
  if (errorCode) {
    return <ErrorPage statusCode={errorCode} />;
  }

  return (
    <div className="terminal-frame">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>
        <Hero />
        <Writeups />
        <Projects />
        <About />
      </main>
      <Footer />
    </div>
  );
}

export default App;
