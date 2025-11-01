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
          <p>{config.about.mainText}</p>
          <p>{config.about.additionalText}</p>

          <div className="skills">
            {config.skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        <div className="about-sidebar">
          {config.about.statusBoxes.map((box, index) => (
            <div key={index} className="info-box">
              <div className="info-title">{box.title}</div>
              <div className="info-value">{box.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
