import React, { useState } from 'react';
import { 
  RotateCcw, 
  Play, 
  Loader2, 
  KeyRound, 
  ExternalLink, 
  Menu, 
  X,
  BrainCircuit
} from 'lucide-react';

/**
 * Navbar Component - Top Navigation Bar
 * Features:
 * - Project name / Logo
 * - Links: Dashboard, Architecture, Evolution, History, Model Analytics, API Session
 * - Quick Action: "Run Evolution" button & "Reset"
 * - Responsive mobile menu
 * - Clean Lucide React icons (no emojis)
 */
export default function Navbar({ 
  onRunEvolution, 
  onResetEvolution, 
  isEvolving, 
  onReturnToWelcome,
  activeSection = 'dashboard',
  sessionKey,
  hasEnvKey
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', href: '#dashboard-overview' },
    { id: 'architecture', label: 'Architecture', href: '#neural-network' },
    { id: 'evolution', label: 'Evolution', href: '#evolution-section' },
    { id: 'history', label: 'History', href: '#evolution-history' },
    { id: 'analytics', label: 'Model Analytics', href: '#ai-model-comparison' },
    { id: 'api-session', label: 'API Session', href: '#api-session' },
  ];

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="top-navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div className="navbar-brand" onClick={onReturnToWelcome} style={{ cursor: 'pointer' }} title="Self-Evolving Neural Networks">
          <div className="brand-icon-wrapper brand-img-wrapper">
            <img src="/logo.png" alt="Self-Evolving Neural Networks Logo" className="navbar-project-logo" />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">Self-Evolving Neural Networks</span>
            <span className="brand-badge font-mono">Performance-Driven Architecture Mutation</span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className={`navbar-nav ${mobileOpen ? 'nav-open' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`nav-item-link ${activeSection === link.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="navbar-actions">
          {sessionKey ? (
            <button
              className="btn btn-secondary btn-sm nav-api-pill"
              onClick={() => handleNavClick('#api-session')}
              title={`API Key active (${hasEnvKey ? '.env' : 'Session Memory'}). Click to view API Session Security.`}
            >
              <KeyRound size={13} strokeWidth={2.2} />
              <span className="api-pill-dot" />
              <span className="api-pill-text">{hasEnvKey ? '.env Key Active' : 'API Active'}</span>
            </button>
          ) : (
            <button
              className="btn btn-secondary btn-sm nav-api-pill inactive"
              onClick={() => handleNavClick('#api-session')}
              title="No active API key. Click to configure API Session Security."
            >
              <KeyRound size={13} strokeWidth={2} />
              <span className="api-pill-dot inactive" />
              <span className="api-pill-text">No Key</span>
            </button>
          )}

          <button
            className="btn btn-secondary btn-sm nav-action-btn"
            onClick={onResetEvolution}
            title="Reset model to baseline 72% performance"
            disabled={isEvolving}
          >
            <RotateCcw size={13} strokeWidth={2} />
            <span>Reset</span>
          </button>

          <button
            className={`btn btn-primary btn-sm btn-nav-run ${isEvolving ? 'running' : ''}`}
            onClick={onRunEvolution}
            disabled={isEvolving}
          >
            {isEvolving ? (
              <Loader2 size={14} className="spin-icon" strokeWidth={2.5} />
            ) : (
              <Play size={13} strokeWidth={2.5} />
            )}
            <span>{isEvolving ? 'Evolving...' : 'Run Evolution'}</span>
          </button>

          <button
            className="btn btn-secondary btn-sm btn-welcome-portal"
            onClick={onReturnToWelcome}
            title="Switch to Welcome Portal"
          >
            <ExternalLink size={13} strokeWidth={1.8} />
            <span>Portal</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            className="mobile-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
