import React, { useState } from 'react';
import { 
  KeyRound, 
  RotateCcw, 
  Trash2, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { formatApiKey, maskApiKey, ENV_API_KEY } from '../utils/apiKey.js';

/**
 * ApiKeyPanel Component
 * Handles client-side temporary API session keys securely in React memory
 * and supports environment-level configuration (.env).
 * 
 * Strict Security Guarantees:
 * - Configured via .env (VITE_API_KEY) and stored in memory.
 * - Never stored in localStorage or sessionStorage.
 * - Never persisted in a database.
 * - Cleared upon session termination or masked in UI.
 * - Uses clean Lucide React icons.
 */
export default function ApiKeyPanel({ 
  sessionKey, 
  hasEnvKey, 
  hasServerKey = false,
  onGenerateKey, 
  onResetToEnvKey, 
  onClearKey 
}) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Clean canonical representations using utility
  const fullDisplayKey = formatApiKey(sessionKey);
  const maskedKey = maskApiKey(sessionKey);
  const isServerSecured = Boolean(hasServerKey);
  const isEnvConfiguredKey = hasEnvKey && fullDisplayKey === formatApiKey(ENV_API_KEY);

  const handleCopy = () => {
    if (!sessionKey) return;
    navigator.clipboard.writeText(fullDisplayKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="api-session" className="dashboard-section card apikey-section-card">
      <div className="section-header-row">
        <div className="section-title-wrap">
          <div className="section-icon-badge icon-amber">
            <KeyRound size={20} strokeWidth={2} color="#f59e0b" />
          </div>
          <div>
            <h2 className="section-heading">API CONFIGURATION &amp; SESSION SECURITY</h2>
            <p className="section-subheading">
              Vercel Serverless Vault &amp; Ephemeral Memory Session Key for Autonomous Agent Interaction
            </p>
          </div>
        </div>

        <div className={`session-status-badge ${sessionKey || isServerSecured ? 'status-active' : 'status-inactive'}`}>
          <span className="status-dot" />
          <span>
            Status: {isServerSecured
              ? 'Active (Vercel Serverless Secured)'
              : sessionKey
              ? isEnvConfiguredKey
                ? 'Active (.env Loaded)'
                : 'Active (Session Memory)'
              : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Key Display & Control Card */}
      <div className="apikey-display-container">
        <div className="apikey-label-row">
          <span className="apikey-label">Active API Key:</span>
          <span className="security-guarantee-tag font-mono">
            {isServerSecured
              ? 'Vercel Serverless Vault • EVOLVE_API_KEY'
              : isEnvConfiguredKey
              ? 'Loaded from .env (VITE_API_KEY)'
              : 'Ephemeral Memory • Zero-Storage'}
          </span>
        </div>

        <div className="apikey-input-group">
          <div className="key-display-box font-mono">
            {sessionKey ? (
              showKey ? (
                <span className="key-text-revealed">{fullDisplayKey}</span>
              ) : (
                <span className="key-text-masked">{maskedKey}</span>
              )
            ) : (
              <span className="key-placeholder">No active session key loaded.</span>
            )}
          </div>

          {sessionKey && (
            <div className="key-action-buttons">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setShowKey(!showKey)}
                title={showKey ? 'Mask session key' : 'Reveal session key'}
              >
                {showKey ? (
                  <>
                    <EyeOff size={13} strokeWidth={2} />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye size={13} strokeWidth={2} />
                    <span>Show</span>
                  </>
                )}
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={handleCopy}
                title="Copy active API key"
              >
                {copied ? (
                  <>
                    <Check size={13} strokeWidth={2.5} color="#10b981" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} strokeWidth={2} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Buttons: Generate New Key, Restore .env Key & Clear Key */}
        <div className="apikey-controls-bar">
          <button 
            id="btn-generate-key"
            className="btn btn-primary"
            onClick={onGenerateKey}
          >
            <KeyRound size={14} strokeWidth={2} />
            <span>Generate New Session Key</span>
          </button>

          {hasEnvKey && (
            <button 
              id="btn-reset-env-key"
              className="btn btn-secondary"
              onClick={() => {
                if (onResetToEnvKey) onResetToEnvKey();
                setShowKey(false);
              }}
              title="Reload configured API key from .env"
            >
              <RotateCcw size={14} strokeWidth={2} />
              <span>Restore .env Key</span>
            </button>
          )}

          <button 
            id="btn-clear-key"
            className="btn btn-secondary"
            onClick={() => {
              onClearKey();
              setShowKey(false);
            }}
            disabled={!sessionKey}
          >
            <Trash2 size={14} strokeWidth={2} />
            <span>Clear Key</span>
          </button>
        </div>

        {/* Security Disclaimers Checklist */}
        <div className="security-notice-list">
          <div className="notice-item">
            <CheckCircle2 size={14} strokeWidth={2.2} className="notice-check-lucide" color="#10b981" />
            <span>Generated locally via <code>crypto.getRandomValues()</code> or verified via Vercel Serverless Vault.</span>
          </div>
          <div className="notice-item">
            <CheckCircle2 size={14} strokeWidth={2.2} className="notice-check-lucide" color="#10b981" />
            <span>Held strictly in React state memory; never written to localStorage or cookies.</span>
          </div>
          <div className="notice-item">
            <CheckCircle2 size={14} strokeWidth={2.2} className="notice-check-lucide" color="#10b981" />
            <span>Automatically cleared upon browser reload or tab closure.</span>
          </div>
          <div className="notice-item">
            <ShieldCheck size={14} strokeWidth={2.2} className="notice-check-lucide" color="#10b981" />
            <span>Backend environment variables (<code>EVOLVE_API_KEY</code>) are never exposed to browser bundles.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
