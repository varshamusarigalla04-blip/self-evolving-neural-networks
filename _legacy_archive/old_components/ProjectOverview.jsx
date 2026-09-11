import React from 'react';

/**
 * Project Overview Component
 * Introduces the project title, core concept, and high-level architectural workflow.
 */
export default function ProjectOverview() {
  const highlights = [
    {
      title: 'Performance-Driven Mutation',
      desc: 'Topology mutations are autonomously triggered when loss gradients plateau or latency spikes.',
      tag: 'Adaptive Engine',
      color: 'cyan'
    },
    {
      title: 'Dynamic Topology Morphing',
      desc: 'Injects or prunes neurons and synaptic pathways dynamically while preserving learned weights.',
      tag: 'Zero Retrain Cost',
      color: 'purple'
    },
    {
      title: 'Pareto Fitness Optimization',
      desc: 'Evaluates candidates across accuracy, inference latency, parameter count, and energy efficiency.',
      tag: 'Multi-Objective',
      color: 'emerald'
    },
    {
      title: 'Autonomous Decision Agent',
      desc: 'Rolls back detrimental mutations and locks in beneficial topologies based on rigorous thresholds.',
      tag: 'Self-Guarded',
      color: 'amber'
    }
  ];

  return (
    <section id="overview" className="overview-hero card">
      <div className="hero-glow-layer" />
      
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-sparkle">✦</span>
          <span>Next-Generation Neural Architecture Search (NAS)</span>
        </div>

        <h1 className="hero-title">
          Self-Evolving Neural Networks Using{' '}
          <span className="gradient-text">Performance-Driven Architecture Mutation</span>
        </h1>

        <p className="hero-description">
          An autonomous deep learning framework where neural network architectures dynamically 
          self-adapt and evolve their topology—expanding layers, pruning dormant synapses, and optimizing 
          connection pathways in real-time driven by live performance metrics and multi-objective fitness evaluation.
        </p>

        {/* Highlight Badges Grid */}
        <div className="highlights-grid">
          {highlights.map((item, idx) => (
            <div key={idx} className={`highlight-card highlight-${item.color}`}>
              <div className="highlight-tag">{item.tag}</div>
              <h3 className="highlight-title">{item.title}</h3>
              <p className="highlight-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
