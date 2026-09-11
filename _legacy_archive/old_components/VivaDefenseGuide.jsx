import React from 'react';

export default function VivaDefenseGuide() {
  return (
    <section className="card">
      <div className="card-header">
        <div className="card-title-wrap">
          <span className="card-icon">🎓</span>
          <div>
            <h2 className="card-title">Viva Defense &amp; Project Evaluation Guide</h2>
            <div className="card-subtitle">How this autonomous agentic system functions</div>
          </div>
        </div>
      </div>

      <div className="viva-grid">
        <div className="viva-card">
          <h5>1. Performance Evaluation</h5>
          <p>The system evaluates current neural-network accuracy, loss, and latency, computing an objective performance score to determine if improvements are required.</p>
        </div>
        <div className="viva-card">
          <h5>2. Performance-Driven Mutation</h5>
          <p>When accuracy falls below the target threshold or latency bloat is detected, the agent autonomously generates topology mutations (adding or pruning neurons/layers).</p>
        </div>
        <div className="viva-card">
          <h5>3. Keep / Mutate / Reject Decision</h5>
          <p>Candidate architectures are benchmarked. If the new architecture outperforms the baseline, the decision is <strong>Keep</strong>. If degraded, it is <strong>Reject</strong> and the baseline is retained.</p>
        </div>
      </div>
    </section>
  );
}
