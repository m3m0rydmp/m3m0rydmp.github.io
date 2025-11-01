import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Writeups from './components/Writeups';
import Projects from './components/Projects';
import About from './components/About';
import Footer from './components/Footer';
import ErrorPage from './components/ErrorPage';
import './App.css';

// Main home page component
function HomePage({ activeSection, setActiveSection }) {
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

function App() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <Router>
      <Routes>
        {/* Main home page */}
        <Route 
          path="/" 
          element={<HomePage activeSection={activeSection} setActiveSection={setActiveSection} />} 
        />
        
        {/* Error pages */}
        <Route path="/404" element={<ErrorPage statusCode={404} />} />
        <Route path="/403" element={<ErrorPage statusCode={403} />} />
        <Route path="/50x" element={<ErrorPage statusCode={500} />} />
        
        {/* Catch all other routes and show 404 */}
        <Route path="*" element={<ErrorPage statusCode={404} />} />
      </Routes>
    </Router>
  );
}

export default App;
