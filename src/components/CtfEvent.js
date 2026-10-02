import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import writeupsData from '../data/writeupsData.json';
import { sortWriteups } from '../algorithms/sortWriteups';
import './CtfEvent.css';

export default function CtfEvent({ event }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('added');
  const [direction, setDirection] = useState('desc');
  const [notes, setNotes] = useState('');
  const [failed, setFailed] = useState(false);
  const challenges = useMemo(() => writeupsData.items.filter(item => item.eventSlug === event.slug), [event.slug]);
  const categories = [...new Set(challenges.map(item => item.category))];
  const visible = sortWriteups(challenges.filter(item =>
    (category === 'All' || item.category === category) &&
    `${item.title} ${item.category} ${item.difficulty}`.toLowerCase().includes(query.trim().toLowerCase())
  ), sortBy, direction);

  useEffect(() => {
    const controller = new AbortController();
    fetch(event.sourcePath, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Unable to load notes'); return response.text(); })
      .then(text => setNotes(text.replace(/^# .+\r?\n/m, '').replace(/^(platform|difficulty|os|category|tags|date|added|type):.*\r?\n/gmi, '').trim()))
      .catch(error => { if (error.name !== 'AbortError') setFailed(true); });
    return () => controller.abort();
  }, [event.sourcePath]);

  return (
    <article className="ctf-event">
      <Helmet><title>{event.title} | m3m0rydmp</title><meta name="description" content={`Browse ${challenges.length} challenge writeups from ${event.title}.`} /></Helmet>
      <nav className="ctf-breadcrumb" aria-label="Breadcrumb"><Link to="/writeups/platform/ctfs">CTF library</Link><span>/</span><span>{event.title}</span></nav>
      <header className="ctf-event-header">
        <p className="ctf-eyebrow">EVENT LIBRARY · HACK THE BOX</p>
        <h1>{event.title}</h1>
        <p>These investigations took place inside the event's fictional intelligence scenario. The people, organizations, and alerts below are challenge evidence, not allegations about real-world activity.</p>
        <p className="ctf-event-count">{challenges.length} challenges · {categories.length} categories</p>
      </header>
      <div className="ctf-category-filters" aria-label="Challenge categories">
        {['All', ...categories].map(name => <button key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(name)}>{name} <span>{name === 'All' ? challenges.length : challenges.filter(item => item.category === name).length}</span></button>)}
      </div>
      <div className="ctf-controls">
        <label className="ctf-search">Find a challenge<input type="search" value={query} placeholder="Name, category, or difficulty" onChange={e => setQuery(e.target.value)} /></label>
        <label>Sort by<select value={sortBy} onChange={e => { setSortBy(e.target.value); setDirection(['name', 'difficulty'].includes(e.target.value) ? 'asc' : 'desc'); }}><option value="added">Recently added</option><option value="name">Name</option><option value="difficulty">Difficulty</option><option value="date">Writeup date</option></select></label>
        <label>Order<select value={direction} onChange={e => setDirection(e.target.value)}><option value="asc">Ascending</option><option value="desc">Descending</option></select></label>
      </div>
      <p className="ctf-results" role="status">{visible.length} of {challenges.length} challenges</p>
      <div className="ctf-challenge-grid">
        {visible.map(item => <Link className="ctf-challenge-card" key={item.slug} to={`/writeups/${item.slug}`}>
          <div className="ctf-card-meta"><span>{item.category}</span><span className={`ctf-level ${item.difficulty.toLowerCase().replace(/\s+/g, '-')}`}>{item.difficulty === 'Unknown' ? 'Unrated' : item.difficulty}</span></div>
          <h2>{item.title}</h2>
          <div className="ctf-card-footer"><span>{item.coverage === 'Solve note' ? 'Brief solve note' : item.readTime}</span><span aria-hidden="true">Read →</span></div>
        </Link>)}
      </div>
      {!visible.length && <p>No matching challenges. Try another category or search.</p>}
      <details className="ctf-event-notes"><summary>About the event, sources, and verification</summary><div>{failed ? <p>Notes could not load. Refresh to try again.</p> : notes ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes}</ReactMarkdown> : <p>Loading event notes…</p>}</div></details>
    </article>
  );
}
