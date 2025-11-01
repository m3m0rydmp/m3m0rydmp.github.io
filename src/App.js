import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Writeups from './components/Writeups';
import Projects from './components/Projects';
import About from './components/About';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');

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
