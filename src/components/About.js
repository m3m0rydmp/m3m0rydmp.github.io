import React from 'react';
import config from '../config';
import './About.css';

function About() {
  return (
    <section id="about" className="about">
      <div className="section-header">
        <h2 className="section-title">{config.about.sectionTitle}</h2>
        <div className="title-underline"></div>
      </div>

      <div className="about-content">
        <div className="about-text">
          <p className="about-intro">Live from the lab, one exploit and one lesson at a time.</p>
          <p>{config.about.mainText}</p>
          <p>{config.about.additionalText}</p>

          <div className="skills">
            {config.skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        <div className="about-sidebar">
          <div className="about-monitor">
            <p className="monitor-title">System Feed</p>
            <ul className="monitor-list">
              {config.about.statusBoxes.map((box, index) => (
                <li key={index} className="monitor-item">
                  <span className="monitor-key">{box.title}</span>
                  <strong className="monitor-value">{box.value}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
