import React from 'react';
import './ErrorBoundary.css';

// Class component: React error boundaries (componentDidCatch / static
// getDerivedStateFromError) have no hooks equivalent. This wraps the lazy
// <Suspense> routes so a chunk-load failure (e.g. a stale deploy still
// cached in the browser) renders a themed panel instead of a white screen.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Render error caught by ErrorBoundary:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-panel">
          <p className="error-boundary-eyebrow">{'// RUNTIME EXCEPTION'}</p>
          <h2 className="error-boundary-title">MODULE FAILED TO LOAD</h2>
          <p className="error-boundary-message">
            Something broke while rendering this page — often fixed by a reload
            (stale cached build).
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
