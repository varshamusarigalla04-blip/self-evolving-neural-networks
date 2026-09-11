import React from 'react';

export default function ExecutiveDashboard({ metrics, generation, targetFitness }) {
  return (
    <section className="card" id="dashboard">
      <div className="perf-overview-header">
        <div className="card-title-wrap">
          <span className="card-icon">📈</span>
          <h2 className="card-title">Performance Overview &amp; Telemetry</h2>
        </div>
        <div className="prototype-disclaimer-pill">
          <span>⚠️</span> Performance-Driven Simulation Metrics
        </div>
      </div>

      <div className="metric-cards-grid">
        {/* Score Card */}
        <div className="metric-card-box highlight-card">
          <div className="metric-card-label">
            <span>Performance Score</span>
            <span style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem' }}>Target: {targetFitness}%</span>
          </div>
          <div className="metric-card-val" style={{ color: 'var(--accent-cyan-light)' }}>
            {metrics.performanceScore.toFixed(1)}%
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, Math.max(5, metrics.performanceScore))}%` }}></div>
          </div>
          <div className="metric-card-sub">Combined capacity &amp; latency metric</div>
        </div>

        {/* Accuracy */}
        <div className="metric-card-box">
          <div className="metric-card-label">
            <span>Simulated Accuracy</span>
            <span style={{ color: 'var(--accent-emerald)' }}>Normalized</span>
          </div>
          <div className="metric-card-val" style={{ color: 'var(--accent-emerald-light)' }}>
            {metrics.accuracy.toFixed(1)}%
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, Math.max(5, metrics.accuracy))}%`, background: 'var(--accent-emerald)' }}></div>
          </div>
          <div className="metric-card-sub">Decision boundary precision</div>
        </div>

        {/* Loss */}
        <div className="metric-card-box">
          <div className="metric-card-label">
            <span>Loss</span>
            <span style={{ color: 'var(--accent-amber)' }}>Cross-Entropy</span>
          </div>
          <div className="metric-card-val" style={{ color: 'var(--accent-amber)' }}>
            {metrics.loss.toFixed(2)}
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, Math.max(5, (1.5 - metrics.loss) * 66))}%`, background: 'var(--accent-amber)' }}></div>
          </div>
          <div className="metric-card-sub">Inversely proportional to accuracy</div>
        </div>

        {/* Generation */}
        <div className="metric-card-box">
          <div className="metric-card-label">
            <span>Generation</span>
            <span style={{ color: 'var(--accent-purple)' }}>Evolution Cycle</span>
          </div>
          <div className="metric-card-val">
            {generation < 10 ? `0${generation}` : generation}
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, generation * 12)}%`, background: 'var(--accent-purple)' }}></div>
          </div>
          <div className="metric-card-sub">Total architecture cycles evaluated</div>
        </div>
      </div>
    </section>
  );
}
