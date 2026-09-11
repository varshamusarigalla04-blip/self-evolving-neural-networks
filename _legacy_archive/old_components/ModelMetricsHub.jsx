import React from 'react';
import { AI_MODELS_LIST, MODEL_METRICS_DATA } from './common/ModelLogos.jsx';

export default function ModelMetricsHub({ selectedModels, onToggleModel, onSelectAll, onDeselectAll }) {
  return (
    <section className="card" id="model-metrics-hub" style={{ padding: '16px 22px', margin: 0 }}>
      <div className="filter-header-row" style={{ marginBottom: '10px' }}>
        <span className="filter-toolbar-label" style={{ fontSize: '0.86rem' }}>
          <span>⚙️</span> Benchmark AI Models &amp; Architecture Evaluators:
        </span>
        <div className="filter-quick-actions">
          <button className="btn-filter-action" onClick={onSelectAll} title="Select all models">
            <span>✓ Select All</span>
          </button>
          <button className="btn-filter-action" onClick={onDeselectAll} title="Deselect all models">
            <span>✗ Deselect All</span>
          </button>
        </div>
      </div>

      {/* 8 AI Model Filter Pills with Authentic Canonical Logos */}
      <div className="model-checkbox-grid">
        {AI_MODELS_LIST.map(({ id, name, color, LogoComponent, isNvidia }) => {
          const isChecked = selectedModels.has(id);
          return (
            <label 
              key={id} 
              className={`model-checkbox-pill ${isNvidia ? 'pill-nemotron' : ''}`}
              style={{ 
                '--model-color': color,
                borderColor: isNvidia ? '#76b900' : isChecked ? color : 'var(--border-card)'
              }}
            >
              <input 
                type="checkbox" 
                checked={isChecked}
                onChange={() => onToggleModel(id)}
              />
              <span className="pill-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <LogoComponent size={isNvidia ? 18 : 16} color={color} />
              </span>
              
              <span className="pill-name" style={{ color: isNvidia ? '#76b900' : '#fff', fontWeight: isNvidia ? 700 : 600 }}>
                {name}
              </span>

              {isNvidia && (
                <span className="nemotron-badge" style={{ marginLeft: '4px' }}>
                  Featured
                </span>
              )}
            </label>
          );
        })}
      </div>

      {/* MODEL METRICS SECTION - VISUALLY CONNECTED DASHBOARD CARDS */}
      <div className="model-metrics-section">
        <div className="model-metrics-header">
          <div className="model-metrics-title">
            <span>📊</span> Model Metrics
          </div>
          <div className="model-metrics-subnote">
            {selectedModels.size} of {AI_MODELS_LIST.length} AI models active • Click any model card or filter pill to highlight
          </div>
        </div>

        <div className="model-metrics-grid">
          {MODEL_METRICS_DATA.map((m) => {
            const isSelected = selectedModels.has(m.id);
            return (
              <div 
                key={m.id}
                className={`model-metric-card ${isSelected ? 'active' : 'inactive'} ${m.isNvidia ? 'card-nemotron' : ''}`}
                style={{ '--model-color': m.color }}
                onClick={() => onToggleModel(m.id)}
                title={`Click to ${isSelected ? 'deselect' : 'select'} ${m.name}`}
              >
                {/* Card Top: Brand Icon + Exact Model Name + Badge */}
                <div className="model-metric-top">
                  <div className="model-metric-brand">
                    <span className="pill-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <m.LogoComponent size={m.isNvidia ? 19 : 17} color={m.color} />
                    </span>
                    <span className="model-metric-name" style={{ color: m.isNvidia ? '#76b900' : '#fff' }}>
                      {m.name}
                    </span>
                  </div>
                  <span className="model-metric-badge" style={{ 
                    color: m.isNvidia ? '#76b900' : 'var(--text-secondary)',
                    border: m.isNvidia ? '1px solid rgba(118, 185, 0, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: m.isNvidia ? 'rgba(118, 185, 0, 0.14)' : 'rgba(255, 255, 255, 0.04)'
                  }}>
                    {m.badge}
                  </span>
                </div>

                {/* 6 Real Project Benchmark Metrics */}
                <div className="model-metric-stats-grid">
                  <div className="model-stat-item">
                    <span className="model-stat-label">Performance</span>
                    <span className="model-stat-val" style={{ color: m.color }}>{m.performanceScore}%</span>
                  </div>
                  <div className="model-stat-item">
                    <span className="model-stat-label">Accuracy</span>
                    <span className="model-stat-val">{m.accuracy}%</span>
                  </div>
                  <div className="model-stat-item">
                    <span className="model-stat-label">Latency</span>
                    <span className="model-stat-val">{m.latency}</span>
                  </div>
                  <div className="model-stat-item">
                    <span className="model-stat-label">Efficiency</span>
                    <span className="model-stat-val">{m.efficiency}%</span>
                  </div>
                  <div className="model-stat-item">
                    <span className="model-stat-label">Improvement</span>
                    <span className="model-stat-val gain">{m.improvement}</span>
                  </div>
                  <div className="model-stat-item">
                    <span className="model-stat-label">Generation</span>
                    <span className="model-stat-val" style={{ color: 'var(--accent-purple)' }}>{m.currentGeneration}</span>
                  </div>
                </div>

                {/* Card Footer: Selection Status */}
                <div className="model-metric-footer">
                  <span>Status: <strong style={{ color: isSelected ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>{isSelected ? '● Active in Benchmark' : '○ Filtered Out'}</strong></span>
                  <span>Peak: <strong style={{ color: '#fff' }}>{m.peakScore}%</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
