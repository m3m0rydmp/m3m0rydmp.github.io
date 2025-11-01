import React from 'react';
import config from '../config';
import './Projects.css';

function Projects() {
  return (
    <section id="projects" className="projects">
      <div className="section-header">
        <h2 className="section-title">{config.projects.sectionTitle}</h2>
        <div className="title-underline"></div>
      </div>

      <div className="projects-grid">
        {config.projects.items.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-icon">{project.icon}</div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <a href={project.link} className="project-link">EXPLORE →</a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
