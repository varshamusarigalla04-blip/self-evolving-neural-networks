import React from 'react';

/**
 * Sidebar Navigation Component
 * Provides clean navigation across all sections of the dashboard.
 */
export default function Sidebar({ activeSection, onSelectSection, isMobileOpen, onCloseMobile }) {
  const navItems = [
    { id: 'overview', label: 'Project Overview', icon: '⚡' },
    { id: 'network', label: 'Neural Network', icon: '🧠' },
    { id: 'mutation', label: 'Architecture Mutation', icon: '🧬' },
    { id: 'metrics', label: 'Performance Metrics', icon: '📊' },
    { id: 'decision', label: 'Evolution Decision', icon: '⚖️' },
    { id: 'comparison', label: 'Model Comparison', icon: '🔬' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} />
      )}

      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="6" cy="6" r="3" fill="#00f0ff" stroke="#00f0ff"/>
              <circle cx="6" cy="18" r="3" fill="#00f0ff" stroke="#00f0ff"/>
              <circle cx="18" cy="12" r="3" fill="#a855f7" stroke="#a855f7"/>
              <path d="M9 6h6M9 18h6M6 9v6M9 6l6 6M9 18l6-6" stroke="#38bdf8" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">NeuroEvolve</span>
            <span className="brand-tag">Mutation Engine v1.0</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="nav-label">Core Modules</div>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => {
                    onSelectSection(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                  {activeSection === item.id && <span className="active-glow" />}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer Status Widget */}
        <div className="sidebar-status-card">
          <div className="status-header">
            <span className="status-pulse-dot" />
            <span className="status-title">Engine Active</span>
          </div>
          <div className="status-meta">
            <div className="status-row">
              <span>Mode:</span>
              <span className="status-val">Auto-Mutation</span>
            </div>
            <div className="status-row">
              <span>Framework:</span>
              <span className="status-val text-cyan">React + Vite</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
