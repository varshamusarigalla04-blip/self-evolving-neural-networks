import React from 'react';

export default function NetworkVisualizerComponent({ topologyString, animRunning, onReplayAnimation, canvasRef }) {
  return (
    <section id="architecture" className="card">
      <div className="card-header">
        <div className="card-title-wrap">
          <span className="card-icon">🕸️</span>
          <div>
            <h2 className="card-title">Neural Network Architecture Visualization</h2>
            <div className="card-subtitle">{topologyString}</div>
          </div>
        </div>

        <div className="animation-toolbar">
          <div id="animStatusIndicator" className={`anim-status-badge ${animRunning ? 'running' : 'paused'}`}>
            <span className="anim-status-dot"></span>
            <span id="animStatusText">{animRunning ? 'Animation: Running' : 'Animation: Paused'}</span>
          </div>
          <button 
            id="btnReplayAnimation" 
            className="btn btn-secondary" 
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            onClick={onReplayAnimation}
            title="Restart 10-second subtle neuron pulse animation"
          >
            <span>🔁 Replay Animation</span>
          </button>
        </div>
      </div>

      {/* Interactive Canvas Graph */}
      <div className="canvas-container">
        <canvas id="networkCanvas" ref={canvasRef} height="420"></canvas>
      </div>

      {/* Visualizer Color Legend */}
      <div className="network-legend">
        <div className="legend-group">
          <div className="legend-item">
            <div className="legend-dot cyan"></div>
            <span>INPUT LAYER</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot purple"></div>
            <span>HIDDEN LAYERS</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot green"></div>
            <span>OUTPUT LAYER</span>
          </div>
        </div>
        <div className="legend-group">
          <div className="legend-item">
            <div className="legend-dot lime"></div>
            <span>MUTATED / ADDED NEURONS</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot red"></div>
            <span>PRUNED NEURONS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
