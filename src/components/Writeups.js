import React from 'react';
import config from '../config';
import './Writeups.css';

function Writeups() {
  return (
    <section id="writeups" className="writeups">
      <div className="section-header">
        <h2 className="section-title">{config.writeups.sectionTitle}</h2>
        <div className="title-underline"></div>
      </div>

      <div className="writeups-grid">
        {config.writeups.items.map((writeup) => (
          <article key={writeup.id} className="writeup-card">
            <div className="card-header">
              <span className="category-tag">{writeup.category}</span>
              <span className={`difficulty ${writeup.difficulty}`}>
                {writeup.difficulty.toUpperCase()}
              </span>
            </div>

            <h3>{writeup.title}</h3>
            <p>{writeup.description}</p>

            <div className="card-meta">
              <span className="date">{writeup.date}</span>
              <span className="read-time">{writeup.readTime}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Writeups;
