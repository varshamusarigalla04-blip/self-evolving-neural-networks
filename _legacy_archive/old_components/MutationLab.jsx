import React from 'react';

export default function MutationLab({
  mutationRationale,
  isProcessing,
  isAutoRunning,
  speedMs,
  targetFitness,
  onManualMutation,
  onRunEvolution,
  onToggleAutoRun,
  onReset,
  onSpeedChange,
  onTargetChange
}) {
  return (
    <section className="card" id="mutation-controls" style={{ borderTop: '3px solid var(--accent-cyan)' }}>
      <div className="card-header">
        <div className="card-title-wrap">
          <span className="card-icon">⚡</span>
          <div>
            <h2 className="card-title">Architecture Mutation</h2>
            <div className="card-subtitle">
              Autonomous agent mutation operators &amp; primary evolutionary execution controls
            </div>
          </div>
        </div>
        <span className="badge-tag" style={{ background: 'rgba(14, 165, 233, 0.15)', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan-light)' }}>
          🔝 Top Positioned Controls
        </span>
      </div>

      {/* VISUALLY PROMINENT MUTATION DECISION BANNER */}
      <div className="mutation-decision-banner">
        <div className="mutation-decision-header">
          <span className="mutation-decision-tag">
            <span>🧠</span> Active Mutation Decision &amp; Rationale:
          </span>
          <span style={{ 
            fontSize: '0.72rem', 
            fontWeight: 800, 
            color: mutationRationale.badgeColor,
            background: 'rgba(0,0,0,0.3)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: `1px solid ${mutationRationale.badgeColor}`
          }}>
            {mutationRationale.badge}
          </span>
        </div>
        <div className="mutation-decision-rationale">
          {mutationRationale.reason}
        </div>
      </div>

      <div className="mutation-controls-wrap">
        {/* 4 Manual Mutation Action Buttons */}
        <div className="mutation-actions-row">
          <button 
            className="btn-mutation-action" 
            onClick={() => onManualMutation('ADD_NEURON')}
            disabled={isProcessing}
            title="Add neurons to expand hidden layer capacity"
          >
            <span>➕ Add Neuron</span>
          </button>
          <button 
            className="btn-mutation-action" 
            onClick={() => onManualMutation('REMOVE_NEURON')}
            disabled={isProcessing}
            title="Prune neurons from hidden layer"
          >
            <span>➖ Remove Neuron</span>
          </button>
          <button 
            className="btn-mutation-action" 
            onClick={() => onManualMutation('ADD_LAYER')}
            disabled={isProcessing}
            title="Add a hidden layer to increase network depth"
          >
            <span>➕ Add Hidden Layer</span>
          </button>
          <button 
            className="btn-mutation-action" 
            onClick={() => onManualMutation('REMOVE_LAYER')}
            disabled={isProcessing}
            title="Prune hidden layer to reduce latency"
          >
            <span>➖ Remove Hidden Layer</span>
          </button>
        </div>

        {/* Primary Evolution Execution Bar */}
        <div className="main-evolution-action-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${isProcessing ? 'btn-running' : 'btn-primary-glow'}`} 
              onClick={onRunEvolution}
              disabled={isProcessing}
              title="Execute a complete 7-stage evolution cycle"
            >
              <span>{isProcessing ? '⚡ Running Cycle...' : '▶ Run Evolution'}</span>
            </button>
            <button 
              className={`btn ${isAutoRunning ? 'btn-running' : 'btn-secondary'}`} 
              onClick={onToggleAutoRun}
              title="Continuously run autonomous evolution loop"
            >
              <span>{isAutoRunning ? '⏹ Stop Auto Evolve' : '🔁 Auto Evolve'}</span>
            </button>
            <button 
              className="btn btn-danger" 
              onClick={onReset}
              title="Reset system back to initial baseline architecture"
            >
              <span>🔄 Reset Baseline</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div className="control-widget" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <label htmlFor="selectSpeed">Speed:</label>
              <select 
                id="selectSpeed" 
                value={speedMs} 
                onChange={onSpeedChange} 
                style={{ background: '#151d30', border: '1px solid var(--border-card)', color: '#fff', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}
              >
                <option value="2000">Slow (2.0s)</option>
                <option value="1200">Normal (1.2s)</option>
                <option value="600">Fast (0.6s)</option>
              </select>
            </div>

            <div className="control-widget" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <label htmlFor="sliderTargetFitness">
                Target: <strong style={{ color: '#fff' }}>{targetFitness}</strong>%
              </label>
              <input 
                type="range" 
                id="sliderTargetFitness" 
                min="65" 
                max="96" 
                value={targetFitness} 
                onChange={onTargetChange} 
                style={{ accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
