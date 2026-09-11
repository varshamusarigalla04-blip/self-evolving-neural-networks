import React, { useState } from 'react';

/**
 * Model Comparison Component / Section Placeholder
 * Compares mutated generation checkpoints against baseline and reference models.
 */
export default function ModelComparisonSection({ currentGen = 14 }) {
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);

  const models = [
    {
      id: 'gen-00',
      name: 'Generation 00',
      tag: 'Initial Seed',
      arch: '4 → 4 → 2',
      params: '24',
      accuracy: '81.2%',
      latency: '2.8 ms',
      fitness: '0.640',
      status: 'Archived Seed',
      isCurrent: false,
      isBest: false
    },
    {
      id: 'gen-06',
      name: 'Generation 06',
      tag: 'Intermediate',
      arch: '4 → 6 → 4 → 2',
      params: '68',
      accuracy: '88.5%',
      latency: '3.6 ms',
      fitness: '0.785',
      status: 'Promoted',
      isCurrent: false,
      isBest: false
    },
    {
      id: 'gen-current',
      name: `Generation ${currentGen}`,
      tag: 'Current Evolved',
      arch: '4 → 8 → 6 → 2',
      params: '84',
      accuracy: '94.8%',
      latency: '4.2 ms',
      fitness: '0.912',
      status: 'Active Champion',
      isCurrent: true,
      isBest: true
    },
    {
      id: 'static-ref',
      name: 'Static Benchmark MLP',
      tag: 'No Mutation',
      arch: '4 → 16 → 16 → 2',
      params: '368',
      accuracy: '92.1%',
      latency: '7.9 ms',
      fitness: '0.730',
      status: 'Baseline Control',
      isCurrent: false,
      isBest: false
    },
  ];

  const displayedModels = filterActiveOnly 
    ? models.filter(m => m.isCurrent || m.isBest) 
    : models;

  return (
    <section id="comparison" className="card comparison-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-wrap icon-cyan">🔬</div>
          <div>
            <h2 className="card-title">Model Comparison Matrix</h2>
            <p className="card-subtitle">Benchmarking Self-Evolved Chromosomes Against Baseline Controls</p>
          </div>
        </div>
        
        <div className="card-controls">
          <button 
            className={`btn-pill ${filterActiveOnly ? 'active' : ''}`}
            onClick={() => setFilterActiveOnly(!filterActiveOnly)}
          >
            {filterActiveOnly ? 'Show All Models' : 'Show Top Models'}
          </button>
        </div>
      </div>

      {/* Modern Responsive Comparison Table */}
      <div className="table-responsive">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Model Identifier</th>
              <th>Topology</th>
              <th>Parameters</th>
              <th>Accuracy</th>
              <th>Latency</th>
              <th>Fitness</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedModels.map((m) => (
              <tr 
                key={m.id} 
                className={`${m.isCurrent ? 'row-champion' : ''} ${m.isBest ? 'row-best' : ''}`}
              >
                <td>
                  <div className="model-name-cell">
                    <span className="model-name">{m.name}</span>
                    <span className="model-tag">{m.tag}</span>
                  </div>
                </td>
                <td>
                  <code className="topology-code">{m.arch}</code>
                </td>
                <td className="text-muted">{m.params}</td>
                <td>
                  <span className={`acc-badge ${parseFloat(m.accuracy) >= 94 ? 'acc-high' : ''}`}>
                    {m.accuracy}
                  </span>
                </td>
                <td className="text-muted">{m.latency}</td>
                <td>
                  <strong className="fitness-text text-cyan">{m.fitness}</strong>
                </td>
                <td>
                  <span className={`status-pill pill-${m.isCurrent ? 'champion' : 'normal'}`}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="comparison-summary-footer">
        <div className="summary-point">
          <span className="summary-icon">💡</span>
          <span>
            <strong>Key Finding:</strong> Generation {currentGen} achieved <strong>+2.7% higher accuracy</strong> than 
            the Static Benchmark MLP while utilizing <strong>77% fewer parameters</strong> and running in nearly 
            <strong> half the latency</strong>.
          </span>
        </div>
      </div>
    </section>
  );
}
