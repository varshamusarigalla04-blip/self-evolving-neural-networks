import React from 'react';
import { AI_MODELS_LIST } from './common/ModelLogos.jsx';

export default function AIModelComparison({
  selectedModels,
  selectedMetric,
  onToggleModel,
  onMetricSelect,
  mainCanvasRef,
  metricCanvasRef,
  genCanvasRef
}) {
  return (
    <section id="model-comparison" className="card">
      <div className="comparison-card-header">
        <div className="card-title-wrap">
          <span className="card-icon">📈</span>
          <div>
            <h2 className="card-title">AI Model Performance &amp; Variation Analysis</h2>
            <div className="card-subtitle">
              Interactive multi-model benchmarking &amp; empirical variation curves across evaluation runs
            </div>
          </div>
        </div>

        <div className="comparison-header-actions">
          <span className="comparison-live-tag">
            <span className="pulse-dot-green"></span>
            Live Experiment Benchmarks
          </span>
        </div>
      </div>

      {/* 4 SUMMARY STATISTIC TILES */}
      <div className="analytics-summary-bar">
        <div className="analytics-stat-tile">
          <div className="stat-tile-top">
            <span className="stat-tile-label">Best Demo Performance</span>
            <span className="stat-tile-icon">🏆</span>
          </div>
          <div className="stat-tile-val" id="summaryBestPerfVal">95.1%</div>
          <div className="stat-tile-sub" id="summaryBestPerfModel">Claude (Peak Demo)</div>
        </div>

        <div className="analytics-stat-tile">
          <div className="stat-tile-top">
            <span className="stat-tile-label">Cohort Average</span>
            <span className="stat-tile-icon">📊</span>
          </div>
          <div className="stat-tile-val" id="summaryAvgPerfVal">88.6%</div>
          <div className="stat-tile-sub">Active models average</div>
        </div>

        <div className="analytics-stat-tile">
          <div className="stat-tile-top">
            <span className="stat-tile-label">Highest Variation</span>
            <span className="stat-tile-icon">📉</span>
          </div>
          <div className="stat-tile-val" id="summaryHighestVarVal">±2.4%</div>
          <div className="stat-tile-sub" id="summaryHighestVarModel">DeepSeek (Max Spread)</div>
        </div>

        <div className="analytics-stat-tile">
          <div className="stat-tile-top">
            <span className="stat-tile-label">Models Compared</span>
            <span className="stat-tile-icon">🤖</span>
          </div>
          <div className="stat-tile-val" id="summaryModelsCountVal">8 / 8</div>
          <div className="stat-tile-sub">Frontier &amp; open-weight</div>
        </div>
      </div>

      {/* 3 ANALYTICS GRAPHS */}
      <div className="analytics-graphs-container">

        {/* FIRST GRAPH: Multi-Line Performance Across Evaluations */}
        <div className="analytics-graph-card">
          <div className="graph-card-header">
            <div>
              <h3 className="graph-card-title">Performance Variation Across Evaluation Iterations</h3>
              <div className="graph-card-subtitle">Empirical performance tracking across repeated test cycles (Evals 1–8)</div>
            </div>
            <span className="graph-tag">8 Evaluations</span>
          </div>

          <div className="analytics-canvas-wrapper">
            <canvas id="mainVariationCanvas" ref={mainCanvasRef} height="460"></canvas>
            <div id="mainVariationTooltip" className="analytics-tooltip" style={{ display: 'none' }}></div>
          </div>
        </div>

        {/* SECOND GRAPH: Metric-Wise Variation */}
        <div className="analytics-graph-card">
          <div className="graph-card-header">
            <div>
              <h3 className="graph-card-title">Metric-Wise Model Variation</h3>
              <div className="graph-card-subtitle">Side-by-side performance across specialized task capabilities</div>
            </div>
            <div className="metric-dropdown-wrapper">
              <label htmlFor="metricSelectDropdown" className="metric-dropdown-label">Category:</label>
              <select 
                id="metricSelectDropdown" 
                className="metric-dropdown-select" 
                value={selectedMetric}
                onChange={onMetricSelect}
              >
                <option value="Reasoning">Reasoning</option>
                <option value="Coding">Coding</option>
                <option value="Language">Language</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Knowledge">Knowledge</option>
                <option value="Speed">Speed</option>
              </select>
            </div>
          </div>

          <div className="analytics-canvas-wrapper">
            <canvas id="metricVariationCanvas" ref={metricCanvasRef} height="380"></canvas>
            <div id="metricVariationTooltip" className="analytics-tooltip" style={{ display: 'none' }}></div>
          </div>
        </div>

        {/* THIRD GRAPH: Generational Trajectory */}
        <div className="analytics-graph-card">
          <div className="graph-card-header">
            <div>
              <h3 className="graph-card-title">Performance Variation Across Generations</h3>
              <div className="graph-card-subtitle">Trajectory tracking across 8 evolutionary generational epochs (Gen 1 to Gen 8)</div>
            </div>
            <span className="graph-tag">Generations 1–8</span>
          </div>

          {/* Interactive Model Legend Chips */}
          <div className="graph-model-legend-bar">
            <span className="legend-bar-title">Generational Curves:</span>
            {AI_MODELS_LIST.map(m => (
              <span 
                key={m.id} 
                className={`graph-legend-chip ${selectedModels.has(m.id) ? 'active' : 'inactive'}`}
                style={{ '--chip-color': m.color }}
                onClick={() => onToggleModel(m.id)}
                title={`Click to filter ${m.name}`}
              >
                <span className="legend-chip-dot" style={{ background: m.color }}></span>
                <span className="legend-chip-name">{m.name}</span>
              </span>
            ))}
          </div>

          <div className="analytics-canvas-wrapper">
            <canvas id="generationVariationCanvas" ref={genCanvasRef} height="380"></canvas>
            <div id="generationVariationTooltip" className="analytics-tooltip" style={{ display: 'none' }}></div>
          </div>
        </div>

      </div>

      <div className="comparison-footnote">
        <span>*</span> Performance values are illustrative and may vary depending on model version, task, benchmark and evaluation method. Values shown are simulated demonstration metrics for college project presentation purposes.
      </div>
    </section>
  );
}
