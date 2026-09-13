import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("FORGE Client Error caught by boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleResetAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }
    window.location.href = window.location.origin + window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#060a12',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '560px',
            backgroundColor: '#0c1424',
            border: '2px solid rgba(20, 184, 166, 0.4)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px', color: '#fff' }}>
              FORGE System Live Recovery
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '18px', lineHeight: '1.6' }}>
              Click below to reset cache and launch the high-velocity live workspace.
            </p>

            {this.state.error && (
              <div style={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(244,63,94,0.3)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '20px',
                textAlign: 'left',
                fontFamily: 'monospace',
                fontSize: '11px',
                color: '#fca5a5',
                maxHeight: '120px',
                overflow: 'auto',
                wordBreak: 'break-all'
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleResetAndReload}
              style={{
                background: 'linear-gradient(to right, #14b8a6, #06b6d4)',
                color: '#020617',
                fontWeight: 900,
                fontSize: '13px',
                padding: '12px 28px',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(20, 184, 166, 0.3)'
              }}
            >
              LAUNCH LIVE FORGE WORKSPACE ↺
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
