import React from 'react';

/**
 * Performance Metrics Component / Section Placeholder
 * Displays real-time evaluation telemetry, accuracy, loss, and latency metrics.
 */
export default function PerformanceMetricsSection({ accuracy = 94.8, loss = 0.142, latency = 4.2 }) {
  const metrics = [
    {
      label: 'Validation Accuracy',
      value: `${accuracy}%`,
      change: '+3.2%',
      positive: true,
      color: 'emerald',
      progress: accuracy,
      icon: '🎯',
      sub: 'Target: >92.0%'
    },
    {
      label: 'Cross-Entropy Loss',
      value: loss.toFixed(3),
      change: '-0.068',
      positive: true,
      color: 'cyan',
      progress: Math.max(10, 100 - loss * 300),
      icon: '📉',
      sub: 'Plateau threshold: 0.001'
    },
    {
      label: 'Inference Latency',
      value: `${latency} ms`,
      change: '-18.5%',
      positive: true,
      color: 'purple',
      progress: 75,
      icon: '⚡',
      sub: 'Edge budget: <8.0 ms'
    },
    {
      label: 'Model FLOPs / Params',
      value: '1.85 M',
      change: '-24.0%',
      positive: true,
      color: 'amber',
      progress: 68,
      icon: '📦',
      sub: 'Active synapses: 84'
    }
  ];

  return (
    <section id="metrics" className="card metrics-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-wrap icon-emerald">📊</div>
          <div>
            <h2 className="card-title">Performance Metrics</h2>
            <p className="card-subtitle">Real-Time Multi-Objective Telemetry & Fitness Scoring</p>
          </div>
        </div>
        <div className="card-badge badge-emerald">
          <span>● Fitness Threshold Exceeded</span>
        </div>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="metrics-grid">
        {metrics.map((item, idx) => (
          <div key={idx} className={`metric-tile border-${item.color}`}>
            <div className="metric-tile-header">
              <span className="metric-icon">{item.icon}</span>
              <span className={`metric-delta ${item.positive ? 'positive' : 'negative'}`}>
                {item.change}
              </span>
            </div>

            <div className="metric-value-wrap">
              <span className="metric-val">{item.value}</span>
              <span className="metric-name">{item.label}</span>
            </div>

            {/* Mini Progress Bar */}
            <div className="metric-progress-track">
              <div 
                className={`metric-progress-fill fill-${item.color}`}
                style={{ width: `${Math.min(100, Math.max(5, item.progress))}%` }}
              />
            </div>

            <div className="metric-tile-footer">
              <span className="metric-subtext">{item.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Fitness Calculation Formula Explainer */}
      <div className="fitness-formula-box">
        <div className="formula-header">
          <span className="formula-icon">📐</span>
          <span className="formula-title">Multi-Objective Fitness Formulation:</span>
        </div>
        <div className="formula-code">
          <code>Fitness(M) = (w_acc · Accuracy) - (w_lat · Latency_norm) - (w_size · Params_norm)</code>
        </div>
        <p className="formula-desc">
          Only mutations producing a strictly positive fitness delta (ΔFitness &gt; 0.015) are accepted into subsequent evolutionary generations.
        </p>
      </div>
    </section>
  );
}
