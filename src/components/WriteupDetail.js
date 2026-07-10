import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import GithubSlugger from 'github-slugger';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowUp, List, Lock, ShieldAlert } from 'lucide-react';
import writeupsData from '../data/writeupsData.json';
import './WriteupDetail.css';

// Register languages for the syntax highlighter. PrismLight (not the full
// Prism bundle) is used intentionally to keep the bundle small — languages
// must be registered explicitly.
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import powershell from 'react-syntax-highlighter/dist/esm/languages/prism/powershell';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
import http from 'react-syntax-highlighter/dist/esm/languages/prism/http';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import ini from 'react-syntax-highlighter/dist/esm/languages/prism/ini';
import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker';
import diff from 'react-syntax-highlighter/dist/esm/languages/prism/diff';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('powershell', powershell);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('http', http);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('ini', ini);
SyntaxHighlighter.registerLanguage('docker', docker);
SyntaxHighlighter.registerLanguage('diff', diff);
SyntaxHighlighter.registerLanguage('markup', markup);
SyntaxHighlighter.registerLanguage('csharp', csharp);

const METADATA_LINE_RE = /^(platform|difficulty|os|category|tags?|date)\s*:\s*(.+)$/i;
// Zero-width space/non-joiner/joiner/BOM characters Notion sometimes exports.
const ZERO_WIDTH_RE = /[​‌‍﻿]/g;

function getDifficultyClass(value) {
  const normalized = (value || '').toLowerCase();
  if (normalized.includes('insane')) return 'insane';
  if (normalized.includes('medium')) return 'medium';
  if (normalized.includes('very easy')) return 'very-easy';
  if (normalized.includes('easy')) return 'easy';
  if (normalized.includes('hard')) return 'hard';
  return 'unknown';
}

function getOsClass(value) {
  const normalized = (value || '').toLowerCase();
  if (normalized.includes('windows')) return 'windows';
  if (normalized.includes('linux')) return 'linux';
  return 'unknown-os';
}

function getCategoryClass(value) {
  const normalized = (value || '').toLowerCase();
  if (normalized.includes('offensive') || normalized.includes('red')) return 'offensive';
  if (normalized.includes('defensive') || normalized.includes('blue')) return 'defensive';
  return 'neutral-team';
}

// SyntaxHighlighter's vscDarkPlus theme applies its own inline background
// to the wrapping element; `customStyle` overrides that so fenced blocks
// keep the site's card look (bg/border/radius) instead of vsc-plus's own.
const CODE_BLOCK_STYLE = {
  background: '#050b18',
  padding: 'var(--spacing-md)',
  borderRadius: '8px',
  border: '1px solid rgba(84, 193, 230, 0.28)',
  margin: 'var(--spacing-md) 0',
  lineHeight: 1.45,
  boxShadow: 'inset 0 0 0 1px rgba(84, 193, 230, 0.08)',
  overflowX: 'auto'
};

function resolveImageSource(src, assetBase) {
  if (!src) return '';
  if (/^(https?:)?\/\//i.test(src) || src.startsWith('/')) {
    return src;
  }

  const cleanedBase = assetBase?.endsWith('/') ? assetBase.slice(0, -1) : assetBase;
  const normalizedSrc = src.replace(/^\.\//, '');
  if (!cleanedBase) {
    return normalizedSrc;
  }

  return `${cleanedBase}/${normalizedSrc}`.replace(/\\/g, '/');
}

function base64ToBytes(base64) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derives an AES-256-GCM key from a passphrase via PBKDF2-SHA256 and
 * decrypts the ciphertext produced by scripts/lockWriteup.js. This runs
 * entirely client-side (Web Crypto) — the site is static, so there is no
 * server to check the passphrase against; a wrong key simply fails GCM
 * authentication.
 * @param {{salt: string, iv: string, data: string, iter: number}} payload
 * @param {string} passphrase
 * @returns {Promise<string>} decrypted UTF-8 markdown
 */
async function decryptLockedPayload(payload, passphrase) {
  const salt = base64ToBytes(payload.salt);
  const iv = base64ToBytes(payload.iv);
  const dataWithTag = base64ToBytes(payload.data);

  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const aesKey = await window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: payload.iter, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const plainBuffer = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, dataWithTag);
  return new TextDecoder().decode(plainBuffer);
}

function LockedWriteupPanel({ writeup, onUnlocked }) {
  const [keyInput, setKeyInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [denied, setDenied] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!keyInput || busy) return;
    setBusy(true);
    setDenied(false);
    try {
      const requestUrl = encodeURI(writeup.sourcePath);
      const response = await fetch(requestUrl);
      if (!response.ok) throw new Error('Unable to fetch encrypted datashard.');
      const payload = await response.json();
      const plaintext = await decryptLockedPayload(payload, keyInput);
      onUnlocked(plaintext);
    } catch (error) {
      setDenied(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="locked-writeup-panel">
      <div className="locked-writeup-icon">
        {denied ? <ShieldAlert size={40} /> : <Lock size={40} />}
      </div>
      <h2 className="locked-writeup-title">ENCRYPTED DATASHARD</h2>
      <p className="locked-writeup-subtitle">{'// ENTER DECRYPTION KEY'}</p>
      <form className="locked-writeup-form" onSubmit={handleSubmit}>
        <input
          type="password"
          className="locked-writeup-input"
          placeholder="DECRYPTION KEY"
          value={keyInput}
          onChange={(event) => setKeyInput(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          disabled={busy}
        />
        <button type="submit" className="locked-writeup-btn" disabled={busy || !keyInput}>
          {busy ? 'DECRYPTING…' : 'DECRYPT'}
        </button>
      </form>
      {denied && <p className="locked-writeup-denied">ACCESS DENIED // KEY REJECTED</p>}
    </div>
  );
}

function WriteupDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const writeup = useMemo(
    () => writeupsData.items?.find((item) => item.slug === slug),
    [slug]
  );
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('idle');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);

  const assetBase = useMemo(() => {
    if (!writeup) return '';
    const segments = writeup.sourcePath.split('/');
    segments.pop();
    return segments.join('/');
  }, [writeup]);

  /**
   * @time O(n) where n is number of lines in content (max 20 metadata-scanned)
   * @space O(n) for contentLines array copy
   */
  const processedContent = useMemo(() => {
    if (!content) return { markdown: '', metadata: null, toc: [] };

    // Notion exports sometimes include zero-width characters; strip them
    // up front so metadata/heading regexes match reliably.
    const cleanedContent = content.replace(ZERO_WIDTH_RE, '');
    const lines = cleanedContent.split('\n');
    let difficulty = null;
    let os = null;
    let category = null;
    const metadataLineIndexes = [];

    // Metadata lines (Platform/Difficulty/OS/Category/Tags/Date) are
    // stripped independently — a document doesn't need all of them present
    // for the ones that ARE present to be hidden from the rendered body.
    for (let i = 0; i < Math.min(lines.length, 20); i++) {
      const line = lines[i].trim();
      const match = line.match(METADATA_LINE_RE);
      if (!match) continue;

      metadataLineIndexes.push(i);
      const key = match[1].toLowerCase();
      const value = match[2].trim();
      if (key === 'difficulty') difficulty = value;
      else if (key === 'os') os = value;
      else if (key === 'category') category = value;
    }

    const contentLines = [...lines];
    for (let i = metadataLineIndexes.length - 1; i >= 0; i--) {
      contentLines.splice(metadataLineIndexes[i], 1);
    }

    // Extract headings for ToC using the same slug algorithm as
    // rehype-slug (github-slugger), walking ALL heading levels (not just
    // h2/h3) so the slugger's duplicate-suffix counter stays in sync with
    // rehype-slug's actual DOM traversal — otherwise a same-named h1/h4+
    // elsewhere in the doc would shift every subsequent slug out of sync.
    const slugger = new GithubSlugger();
    const toc = [];
    contentLines.forEach((line) => {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2].trim();
        const id = slugger.slug(text);
        if (level === 2 || level === 3) {
          toc.push({ level, text, id });
        }
      }
    });

    const metadata = (difficulty && os && category) ? { difficulty, os, category } : null;

    return {
      markdown: contentLines.join('\n'),
      metadata,
      toc
    };
  }, [content]);

  const markdownComponents = useMemo(() => {
    return {
      img: ({ alt, src = '', ...rest }) => {
        const resolvedSrc = resolveImageSource(src, assetBase);
        return <img {...rest} src={resolvedSrc} alt={alt || ''} loading="lazy" />;
      },
      a: ({ children, ...rest }) => (
        <a {...rest} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
      // react-markdown v9 no longer passes an `inline` prop to `code` — a
      // fenced block and inline code both hit this renderer with no way to
      // tell them apart from the props alone. Instead, `pre` (which only
      // wraps fenced blocks) intercepts its already-rendered <code> child
      // and routes it through the syntax highlighter; this `code` renderer
      // therefore only ever handles genuine inline code.
      code: ({ className, children, ...props }) => (
        <code className={className} {...props}>
          {children}
        </code>
      ),
      pre: ({ children, ...props }) => {
        const codeElement = Array.isArray(children) ? children[0] : children;
        const codeProps = codeElement?.props || {};
        const match = /language-(\w+)/.exec(codeProps.className || '');
        const language = match ? match[1] : 'text';
        const codeString = String(codeProps.children ?? '').replace(/\n$/, '');

        return (
          <SyntaxHighlighter
            style={vscDarkPlus}
            customStyle={CODE_BLOCK_STYLE}
            language={language}
            PreTag="div"
            {...props}
          >
            {codeString}
          </SyntaxHighlighter>
        );
      },
      table: ({ children, ...rest }) => (
        <div className="table-scroll">
          <table {...rest}>{children}</table>
        </div>
      )
    };
  }, [assetBase]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!writeup) {
      navigate('/404', { replace: true });
      return;
    }

    if (writeup.locked) {
      setStatus('locked');
      return;
    }

    let canceled = false;
    const controller = new AbortController();

    async function loadWriteup() {
      setStatus('loading');
      try {
        const requestUrl = encodeURI(writeup.sourcePath);
        const response = await fetch(requestUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Unable to fetch ${requestUrl}`);
        }
        const text = await response.text();
        if (!canceled) {
          setContent(text);
          setStatus('ready');
        }
      } catch (error) {
        if (canceled || controller.signal.aborted) return;
        console.error('Failed to load writeup content:', error);
        setStatus('error');
      }
    }

    loadWriteup();

    return () => {
      canceled = true;
      controller.abort();
    };
  }, [writeup, navigate]);

  if (!writeup) {
    return null;
  }

  // writeup.excerpt comes from the static, build-time writeupsData.json — for
  // the locked entry that's always the generic sidecar excerpt, never real
  // decrypted content, regardless of the current unlock state below.
  const pageDescription = writeup.excerpt || `${writeup.platform} writeup: ${writeup.title}`;

  return (
    <article className="writeup-detail-page">
      <Helmet>
        <title>{writeup.title} | m3m0rydmp</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      {status === 'loading' && <p className="status-line" style={{ padding: '2rem' }}>Initializing markdown parser…</p>}
      {status === 'error' && (
        <p className="status-line error" style={{ padding: '2rem' }}>Unable to load the markdown document. Please refresh and try again.</p>
      )}

      {status === 'locked' && (
        <LockedWriteupPanel
          writeup={writeup}
          onUnlocked={(plaintext) => {
            setContent(plaintext);
            setStatus('ready');
          }}
        />
      )}

      {status === 'ready' && (
        <div className="writeup-layout-container">
          <div className="writeup-main-content">
            {/* Compact Terminal Dashboard Header */}
            <header className="writeup-header-dashboard">
              <div className="writeup-header-content">
                <div className="writeup-header-platform">
                  <span className="bracket">[</span> {writeup.platform} <span className="bracket">]</span>
                  <span className="writeup-header-date">{writeup.displayDate}</span>
                </div>

                <h1 className="writeup-header-title">{writeup.title}</h1>

                {processedContent.metadata && (
                  <div className="md-meta-container header-meta">
                    <span className={`md-meta-pill difficulty ${getDifficultyClass(processedContent.metadata.difficulty)}`}>
                      {processedContent.metadata.difficulty}
                    </span>

                    <span className={`md-meta-pill os ${getOsClass(processedContent.metadata.os)}`}>
                      {processedContent.metadata.os}
                    </span>

                    <span className={`md-meta-pill category ${getCategoryClass(processedContent.metadata.category)}`}>
                      {processedContent.metadata.category}
                    </span>
                  </div>
                )}
              </div>

              {writeup.coverImage && (
                <div className="writeup-header-thumbnail">
                  <img src={writeup.coverImage} alt={`${writeup.title} cover`} loading="lazy" />
                </div>
              )}
            </header>

            <section className="writeup-detail">
              <div className="writeup-body">
                {/* rehype-raw is intentionally NOT used here — omitting it is
                    what keeps raw HTML in markdown escaped/inert instead of
                    rendered, which is the XSS guard for this renderer. */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSlug]}
                  components={markdownComponents}
                >
                  {processedContent.markdown}
                </ReactMarkdown>
              </div>
            </section>
          </div>

          {processedContent.toc.length > 0 && (
            <aside className={`writeup-toc ${isTocOpen ? 'open' : ''}`}>
              <div className="toc-header">
                <h3>TABLE OF CONTENTS</h3>
                <button className="toc-close" onClick={() => setIsTocOpen(false)}>×</button>
              </div>
              <nav>
                <ul>
                  {processedContent.toc.map((item, index) => (
                    <li key={index} className={`toc-level-${item.level}`}>
                      <a 
                        href={`#${item.id}`} 
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(item.id);
                          if (el) {
                            const offset = 80;
                            const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                            window.scrollTo({ top, behavior: 'smooth' });
                          }
                          setIsTocOpen(false);
                        }}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}

          <div className="writeup-actions">
            <button 
              className={`action-btn toc-toggle ${processedContent.toc.length === 0 ? 'hidden' : ''}`}
              onClick={() => setIsTocOpen(!isTocOpen)}
              title="Table of Contents"
            >
              <List size={20} />
            </button>
            <button 
              className={`action-btn scroll-top ${showScrollTop ? 'visible' : ''}`}
              onClick={scrollToTop}
              title="Scroll to Top"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default WriteupDetail;