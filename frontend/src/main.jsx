import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("FORGE Client Error caught by boundary:", error, errorInfo);
  }

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
            maxWidth: '500px',
            backgroundColor: '#0c1424',
            border: '2px solid rgba(20, 184, 166, 0.4)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px', color: '#fff' }}>
              FORGE System Recovered
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px', lineHeight: '1.6' }}>
              A temporary interface state occurred. Click below to reload the high-velocity live workspace.
            </p>
            <button
              onClick={() => window.location.reload()}
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
              RELOAD FORGE WORKSPACE ↺
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
