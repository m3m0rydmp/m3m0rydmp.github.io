import React from 'react';
import './ErrorBoundary.css';

function isChunkLoadError(error) {
  if (!error) return false;
  if (error.name === 'ChunkLoadError') return true;
  const message = String(error.message || '');
  return /loading chunk|failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed/i.test(message);
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isChunk: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, isChunk: isChunkLoadError(error) };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);

    // A failed chunk usually means the browser cached an older build; reload
    // once with a cache-busting param to fetch the current one.
    if (isChunkLoadError(error) && !/[?&]_cb=/.test(window.location.search)) {
      const url = new URL(window.location.href);
      url.searchParams.set('_cb', Date.now().toString());
      window.location.replace(url.toString());
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const recovering = this.state.isChunk && !/[?&]_cb=/.test(window.location.search);
      if (recovering) {
        return (
          <div className="error-boundary-panel">
            <p className="error-boundary-eyebrow">{'// RECONNECTING'}</p>
            <h2 className="error-boundary-title">REESTABLISHING CONNECTION…</h2>
          </div>
        );
      }
      return (
        <div className="error-boundary-panel">
          <p className="error-boundary-eyebrow">{'// RUNTIME EXCEPTION'}</p>
          <h2 className="error-boundary-title">MODULE FAILED TO LOAD</h2>
          <p className="error-boundary-message">
            Something broke while rendering this page — try a reload.
          </p>
          <div className="error-boundary-actions">
            <button type="button" className="btn btn-primary" onClick={this.handleReload}>
              RELOAD
            </button>
            <a href="/" className="btn btn-secondary">
              RETURN HOME
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
