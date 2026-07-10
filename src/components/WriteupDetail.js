import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowUp, List } from 'lucide-react';
import writeupsData from '../data/writeupsData.json';
import './WriteupDetail.css';

// Register common languages for syntax highlighter
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import powershell from 'react-syntax-highlighter/dist/esm/languages/prism/powershell';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('powershell', powershell);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('yaml', yaml);

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
   * @time O(n) where n is number of lines in content (max 15 scanned)
   * @space O(n) for contentLines array copy
   */
  const processedContent = useMemo(() => {
    if (!content) return { markdown: '', metadata: null, toc: [] };

    const lines = content.split('\n');
    let difficulty = null;
    let os = null;
    let category = null;
    let metadataEndIndex = -1;
    const toc = [];

    // Extract headings for ToC
    lines.forEach((line) => {
      const headingMatch = line.match(/^(#{2,3})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2].trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        toc.push({ level, text, id });
      }
    });

    for (let i = 0; i < Math.min(lines.length, 15); i++) {
      const line = lines[i].trim();
      if (/^Difficulty\s*:\s*(.+)$/i.test(line)) {
        difficulty = line.match(/^Difficulty\s*:\s*(.+)$/i)[1].trim();
        metadataEndIndex = Math.max(metadataEndIndex, i);
      } else if (/^OS\s*:\s*(.+)$/i.test(line)) {
        os = line.match(/^OS\s*:\s*(.+)$/i)[1].trim();
        metadataEndIndex = Math.max(metadataEndIndex, i);
      } else if (/^Category\s*:\s*(.+)$/i.test(line)) {
        category = line.match(/^Category\s*:\s*(.+)$/i)[1].trim();
        metadataEndIndex = Math.max(metadataEndIndex, i);
      }
    }

    if (difficulty && os && category) {
      const contentLines = [...lines];
      for (let i = metadataEndIndex; i >= 0; i--) {
        const line = contentLines[i].trim();
        if (/^(Difficulty|OS|Category)\s*:/i.test(line)) {
          contentLines.splice(i, 1);
        }
      }
      return {
        markdown: contentLines.join('\n'),
        metadata: { difficulty, os, category },
        toc
      };
    }

    return { markdown: content, metadata: null, toc };
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
      p: ({ children }) => {
        const childArray = React.Children.toArray(children);
        return <p>{childArray}</p>;
      },
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
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

  return (
    <article className="writeup-detail-page">
      {status === 'loading' && <p className="status-line" style={{ padding: '2rem' }}>Initializing markdown parser…</p>}
      {status === 'error' && (
        <p className="status-line error" style={{ padding: '2rem' }}>Unable to load the markdown document. Please refresh and try again.</p>
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
                    <span className={`md-meta-pill difficulty ${((value) => {
                      const normalized = (value || '').toLowerCase();
                      if (normalized.includes('insane')) return 'insane';
                      if (normalized.includes('medium')) return 'medium';
                      if (normalized.includes('very easy')) return 'very-easy';
                      if (normalized.includes('easy')) return 'easy';
                      if (normalized.includes('hard')) return 'hard';
                      return 'unknown';
                    })(processedContent.metadata.difficulty)}`}>
                      {processedContent.metadata.difficulty}
                    </span>

                    <span className={`md-meta-pill os ${((value) => {
                      const normalized = (value || '').toLowerCase();
                      if (normalized.includes('windows')) return 'windows';
                      if (normalized.includes('linux')) return 'linux';
                      return 'unknown-os';
                    })(processedContent.metadata.os)}`}>
                      {processedContent.metadata.os}
                    </span>

                    <span className={`md-meta-pill category ${((value) => {
                      const normalized = (value || '').toLowerCase();
                      if (normalized.includes('offensive') || normalized.includes('red')) return 'offensive';
                      if (normalized.includes('defensive') || normalized.includes('blue')) return 'defensive';
                      return 'neutral-team';
                    })(processedContent.metadata.category)}`}>
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