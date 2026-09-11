import React, { useState } from 'react';

/**
 * Neural Network Component / Section Placeholder
 * Displays the current active network topology, layer distribution, and synaptic structure.
 */
export default function NeuralNetworkSection({ layers = [4, 8, 6, 2] }) {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(1);

  const layerTypes = [
    { name: 'Input Layer', activation: 'Linear', desc: 'Raw multidimensional feature tensors' },
    { name: 'Hidden Layer 1', activation: 'GELU', desc: 'Feature abstraction & non-linear representation' },
    { name: 'Hidden Layer 2', activation: 'ReLU', desc: 'High-level pattern combination layer' },
    { name: 'Output Layer', activation: 'Softmax', desc: 'Classification probabilities' },
  ];

  const totalNeurons = layers.reduce((a, b) => a + b, 0);
  // Calculate total connections between adjacent layers
  const totalSynapses = layers.reduce((acc, curr, idx) => {
    if (idx === 0) return 0;
    return acc + layers[idx - 1] * curr;
  }, 0);

  return (
    <section id="network" className="card network-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-wrap icon-cyan">🧠</div>
          <div>
            <h2 className="card-title">Neural Network Architecture</h2>
            <p className="card-subtitle">Active Topology: {layers.join(' → ')}</p>
          </div>
        </div>
        <div className="card-badge badge-cyan">
          <span>● Live Graph</span>
        </div>
      </div>

      {/* Network Topology Visualizer Area */}
      <div className="network-visualizer-container">
        <div className="layers-track">
          {layers.map((nodeCount, layerIdx) => (
            <div 
              key={layerIdx} 
              className={`layer-column ${selectedLayerIndex === layerIdx ? 'selected' : ''}`}
              onClick={() => setSelectedLayerIndex(layerIdx)}
            >
              <div className="layer-header">
                <span className="layer-role">{layerTypes[layerIdx]?.name || `Layer ${layerIdx}`}</span>
                <span className="layer-count">{nodeCount} Neurons</span>
              </div>

              {/* Node stack */}
              <div className="neurons-stack">
                {Array.from({ length: Math.min(nodeCount, 8) }).map((_, nIdx) => (
                  <div key={nIdx} className="neuron-node" title={`Neuron L${layerIdx}-N${nIdx}`}>
                    <span className="neuron-core" />
                  </div>
                ))}
                {nodeCount > 8 && (
                  <span className="neuron-overflow">+{nodeCount - 8} more</span>
                )}
              </div>

              <div className="layer-footer">
                <span className="layer-act">{layerTypes[layerIdx]?.activation || 'ReLU'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Informative overlay banner */}
        <div className="visualizer-status-bar">
          <div className="status-stat">
            <span className="stat-label">Total Layers:</span>
            <span className="stat-value">{layers.length}</span>
          </div>
          <div className="status-stat">
            <span className="stat-label">Total Neurons:</span>
            <span className="stat-value text-cyan">{totalNeurons}</span>
          </div>
          <div className="status-stat">
            <span className="stat-label">Active Synapses:</span>
            <span className="stat-value text-purple">{totalSynapses}</span>
          </div>
          <div className="status-stat">
            <span className="stat-label">Pruning Sparsity:</span>
            <span className="stat-value text-emerald">18.5%</span>
          </div>
        </div>
      </div>

      {/* Selected Layer Inspector Details */}
      <div className="layer-inspector">
        <div className="inspector-title">
          Selected: <strong>{layerTypes[selectedLayerIndex]?.name}</strong> ({layers[selectedLayerIndex]} units)
        </div>
        <p className="inspector-desc">{layerTypes[selectedLayerIndex]?.desc}</p>
        <div className="inspector-tags">
          <span className="mini-tag">Activation: {layerTypes[selectedLayerIndex]?.activation}</span>
          <span className="mini-tag">Mutation Eligible: Yes</span>
          <span className="mini-tag">Synaptic Decay Rate: 0.001</span>
        </div>
      </div>
    </section>
  );
}
