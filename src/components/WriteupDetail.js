import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import writeupsData from '../data/writeupsData.json';
import './WriteupDetail.css';

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
    if (!content) return { markdown: '', metadata: null };

    const lines = content.split('\n');
    let difficulty = null;
    let os = null;
    let category = null;
    let metadataEndIndex = -1;

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
        metadata: { difficulty, os, category }
      };
    }

    return { markdown: content, metadata: null };
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
      }
    };
  }, [assetBase]);

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
    <section className="writeup-detail">
      <div className="writeup-body">
        {status === 'loading' && <p className="status-line">Initializing markdown parser…</p>}
        {status === 'error' && (
          <p className="status-line error">Unable to load the markdown document. Please refresh and try again.</p>
        )}
        {status === 'ready' && (
          <>
            {processedContent.metadata && (
              <div className="md-meta-container">
                <p className="md-meta-line">
                  <strong className="md-meta-label">Difficulty:</strong>
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
                </p>
                <p className="md-meta-line">
                  <strong className="md-meta-label">OS:</strong>
                  <span className={`md-meta-pill os ${((value) => {
                    const normalized = (value || '').toLowerCase();
                    if (normalized.includes('windows')) return 'windows';
                    if (normalized.includes('linux')) return 'linux';
                    return 'unknown-os';
                  })(processedContent.metadata.os)}`}>
                    {processedContent.metadata.os}
                  </span>
                </p>
                <p className="md-meta-line">
                  <strong className="md-meta-label">Category:</strong>
                  <span className={`md-meta-pill category ${((value) => {
                    const normalized = (value || '').toLowerCase();
                    if (normalized.includes('offensive') || normalized.includes('red')) return 'offensive';
                    if (normalized.includes('defensive') || normalized.includes('blue')) return 'defensive';
                    return 'neutral-team';
                  })(processedContent.metadata.category)}`}>
                    {processedContent.metadata.category}
                  </span>
                </p>
              </div>
            )}
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {processedContent.markdown}
            </ReactMarkdown>
          </>
        )}
      </div>
    </section>
  );
}

export default WriteupDetail;