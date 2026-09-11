import React from 'react';

/**
 * Header Component
 * Displays system status, top-level controls, and mobile navigation trigger.
 */
export default function Header({ 
  generation, 
  accuracy, 
  topology, 
  onSimulateStep, 
  onReset, 
  onToggleMobileMenu 
}) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="mobile-menu-toggle" 
          onClick={onToggleMobileMenu}
          aria-label="Toggle Navigation Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="header-breadcrumb">
          <span className="breadcrumb-root">AI Architecture Studio</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Active Pipeline</span>
        </div>
      </div>

      <div className="header-right">
        {/* Quick Live Stats Pills */}
        <div className="stat-pill">
          <span className="pill-label">Gen:</span>
          <span className="pill-value text-cyan">#{generation}</span>
        </div>

        <div className="stat-pill">
          <span className="pill-label">Topology:</span>
          <span className="pill-value text-purple">{topology}</span>
        </div>

        <div className="stat-pill">
          <span className="pill-label">Fitness:</span>
          <span className="pill-value text-emerald">{accuracy}%</span>
        </div>

        {/* Action Controls */}
        <div className="header-actions">
          <button 
            className="btn btn-secondary" 
            onClick={onReset}
            title="Reset to baseline architecture"
          >
            Reset
          </button>
          <button 
            className="btn btn-primary" 
            onClick={onSimulateStep}
            title="Simulate next architecture mutation step"
          >
            <span className="btn-icon">⚡</span>
            <span>Simulate Step</span>
          </button>
        </div>
      </div>
    </header>
  );
}
