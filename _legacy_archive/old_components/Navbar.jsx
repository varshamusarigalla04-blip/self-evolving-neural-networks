import React from 'react';

export default function Navbar({ evolutionStatus, isFullscreen, onToggleFullscreen }) {
  return (
    <header className="top-navbar">
      <div className="nav-brand">
        <div className="brand-symbol">🧬</div>
        <div className="brand-details">
          <span className="brand-name">Self-Evolving Neural Networks</span>
          <span className="brand-badge-text">Performance-Driven Architecture Mutation</span>
        </div>
      </div>

      <ul className="nav-links">
        <li><a href="#dashboard" className="nav-link active"><span>📊</span> Dashboard</a></li>
        <li><a href="#model-metrics-hub" className="nav-link"><span>📊</span> Model Metrics</a></li>
        <li><a href="#architecture" className="nav-link"><span>🕸️</span> Architecture</a></li>
        <li><a href="#mutation-controls" className="nav-link"><span>⚡</span> Mutation</a></li>
        <li><a href="#evolution-history-decision" className="nav-link"><span>📜</span> History &amp; Decision</a></li>
        <li><a href="#model-comparison" className="nav-link"><span>📈</span> AI Models</a></li>
      </ul>

      <div className="nav-meta">
        <div className="hero-status-pill" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
          <span className="pulse-dot-green"></span>
          <span>{evolutionStatus === 'IDLE' ? 'System Ready' : `Status: ${evolutionStatus}`}</span>
        </div>

        <button 
          onClick={onToggleFullscreen} 
          className="btn-fullscreen" 
          title="Toggle presentation fullscreen mode"
        >
          <span>{isFullscreen ? '🗗' : '⛶'}</span>
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </button>

        <span className="badge-tag badge-college">🎓 AI Research Project</span>
      </div>
    </header>
  );
}
