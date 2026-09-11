import React from 'react';

export default function AgentDecisionPanel({
  evolutionStatus,
  generation,
  totalMutations,
  bestScore,
  animRunning,
  latestDecision,
  agentLogs,
  onLoadPreset
}) {
  const isAccepted = latestDecision.finalDecision.includes('ACCEPTED') || latestDecision.finalDecision.includes('Keep');
  const isRejected = latestDecision.finalDecision.includes('REJECTED') || latestDecision.finalDecision.includes('Reject');

  return (
    <div className="sidebar-column">
      {/* Quick Telemetry Card */}
      <div className="sidebar-widget">
        <div className="widget-title">
          <span>⚡</span> System Telemetry
        </div>

        <div className="quick-status-list">
          <div className="quick-status-row">
            <span className="quick-label">System State</span>
            <span className="quick-val" style={{ color: evolutionStatus === 'REJECTED' ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
              ● {evolutionStatus}
            </span>
          </div>
          <div className="quick-status-row">
            <span className="quick-label">Active Generation</span>
            <span className="quick-val">{generation < 10 ? `0${generation}` : generation}</span>
          </div>
          <div className="quick-status-row">
            <span className="quick-label">Total Mutations</span>
            <span className="quick-val" style={{ color: 'var(--accent-purple)' }}>
              {totalMutations < 10 ? `0${totalMutations}` : totalMutations}
            </span>
          </div>
          <div className="quick-status-row">
            <span className="quick-label">Peak Performance</span>
            <span className="quick-val" style={{ color: 'var(--accent-cyan-light)' }}>
              {bestScore.toFixed(1)}%
            </span>
          </div>
          <div className="quick-status-row">
            <span className="quick-label">Neuron Animation</span>
            <span className="quick-val" style={{ color: 'var(--text-secondary)' }}>
              {animRunning ? 'Running' : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* AGENT DECISION PANEL */}
      <section id="decision" className="sidebar-widget agent-decision-panel">
        <div className="widget-title">
          <span>🧠</span> Real-Time Agent Decision
        </div>

        <div className="decision-display-card">
          <div className="decision-field-box">
            <span className="decision-field-label">Current Performance</span>
            <span className="decision-field-val">{latestDecision.currentPerformance}</span>
          </div>

          <div className="decision-field-box">
            <span className="decision-field-label">Detected Issue</span>
            <span className="decision-field-val" style={{ fontSize: '0.82rem', color: '#fde68a' }}>
              {latestDecision.detectedIssue}
            </span>
          </div>

          <div className="decision-field-box">
            <span className="decision-field-label">Selected Mutation</span>
            <span className="decision-field-val" style={{ color: 'var(--accent-cyan-light)' }}>
              {latestDecision.selectedMutation}
            </span>
          </div>

          <div className="decision-field-box">
            <span className="decision-field-label">Candidate Architecture</span>
            <span className="decision-field-val" style={{ fontSize: '0.85rem' }}>
              {latestDecision.newArchitecture}
            </span>
          </div>

          <div className="decision-field-box">
            <span className="decision-field-label">Candidate Performance</span>
            <span className="decision-field-val">{latestDecision.newPerformance}</span>
          </div>

          <div className="decision-field-box">
            <span className="decision-field-label">Decision</span>
            <span className={`decision-badge-pill ${isAccepted ? 'accepted' : isRejected ? 'rejected' : 'ready'}`}>
              {isAccepted ? '✓ KEEP CANDIDATE' : 
               isRejected ? '✗ REJECT CANDIDATE' : 
               latestDecision.finalDecision}
            </span>
          </div>

          <div className="decision-reason-box">
            <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.76rem', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              Agent Reasoning:
            </strong>
            <span>“{latestDecision.reason}”</span>
          </div>
        </div>

        {/* Agent Diagnostic Thought Stream */}
        <div>
          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Agent Thought Stream
          </span>
          <div id="agentDecisionLogs" className="logs-container">
            {agentLogs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '8px' }}>
                Awaiting diagnostic thoughts...
              </div>
            ) : (
              agentLogs.slice().reverse().map((log, idx) => (
                <div key={idx} className={`log-item type-${log.type}`}>
                  <div className="log-item-header">
                    <span className="log-item-stage">{log.stage} • {log.title}</span>
                    <span style={{ opacity: 0.7 }}>{log.timestamp}</span>
                  </div>
                  <div className="log-item-msg">{log.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Presentation Scenarios */}
      <div className="sidebar-widget">
        <div className="widget-title">
          <span>🎯</span> Presentation Presets
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => onLoadPreset('balanced')}
            style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '8px 12px' }}
          >
            <span>● Baseline Setup (72%)</span>
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => onLoadPreset('underfitting')}
            style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '8px 12px' }}
          >
            <span>● Underfitting Demo (48%)</span>
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => onLoadPreset('bloat')}
            style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '8px 12px' }}
          >
            <span>● Bloat / Pruning Demo (88%)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
