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

      <ul className="projects-list" aria-label="Featured projects list">
        {config.projects.items.map((project) => (
          <li key={project.id} className="project-row">
            <h3>
              <a
                href={project.link}
                className="project-title-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} repository`}
              >
                {project.title}
              </a>
            </h3>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Projects;
