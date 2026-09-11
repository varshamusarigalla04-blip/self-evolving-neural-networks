import React from 'react';

/**
 * Evolution Decision Component / Section Placeholder
 * Shows the autonomous agent logic that accepts, rejects, or reverts candidate mutations.
 */
export default function EvolutionDecisionSection({ generation = 14 }) {
  const decisionLog = [
    {
      gen: `#${generation}`,
      action: 'ACCEPT_MUTATION',
      status: 'success',
      reason: 'Accuracy improved (+3.2%) while maintaining inference latency below 5ms threshold.',
      delta: '+0.042 ΔFitness'
    },
    {
      gen: `#${generation - 1}`,
      action: 'REJECT_MUTATION',
      status: 'danger',
      reason: 'Deep layer expansion introduced gradient instability and increased latency by 24%.',
      delta: '-0.018 ΔFitness'
    },
    {
      gen: `#${generation - 2}`,
      action: 'ACCEPT_MUTATION',
      status: 'success',
      reason: 'Pruned 14 low-salience synaptic connections with zero loss degradation.',
      delta: '+0.027 ΔFitness'
    }
  ];

  return (
    <section id="decision" className="card decision-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-wrap icon-amber">⚖️</div>
          <div>
            <h2 className="card-title">Evolution Decision Engine</h2>
            <p className="card-subtitle">Autonomous Pareto Gatekeeper & Verification Loop</p>
          </div>
        </div>
        <div className="card-badge badge-emerald">
          <span>✔ Latest: ACCEPTED</span>
        </div>
      </div>

      {/* Active Verdict Banner */}
      <div className="decision-verdict-box">
        <div className="verdict-header">
          <div className="verdict-stamp stamp-accept">
            <span className="stamp-icon">✓</span>
            <span className="stamp-text">MUTATION ACCEPTED</span>
          </div>
          <span className="verdict-time">Evaluation Timestamp: Just now</span>
        </div>

        <div className="verdict-body">
          <p className="verdict-summary">
            Candidate <strong>Arch-Gen{generation}-MutA</strong> passed all Pareto convergence tests. 
            Validation accuracy increased from <strong>91.6%</strong> to <strong>94.8%</strong>, 
            and total active weights decreased by <strong>8.5%</strong>.
          </p>

          <div className="verdict-checklist">
            <div className="check-item passed">
              <span className="check-icon">✓</span>
              <span>Accuracy Delta: &gt; +0.5% (Actual: +3.2%)</span>
            </div>
            <div className="check-item passed">
              <span className="check-icon">✓</span>
              <span>Latency Limit: &lt; 8.0 ms (Actual: 4.2 ms)</span>
            </div>
            <div className="check-item passed">
              <span className="check-icon">✓</span>
              <span>Gradient Stability: Vanishing/Exploding Gradient Guard OK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Workflow Steps */}
      <div className="decision-steps-container">
        <h4 className="steps-heading">Autonomous Decision Protocol:</h4>
        <div className="steps-row">
          <div className="step-card">
            <span className="step-num">01</span>
            <span className="step-name">Benchmark</span>
            <p className="step-desc">Evaluate loss & latency on holdout split</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <span className="step-num">02</span>
            <span className="step-name">Score Delta</span>
            <p className="step-desc">Calculate multi-objective ΔFitness</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <span className="step-num">03</span>
            <span className="step-name">Pareto Filter</span>
            <p className="step-desc">Verify dominance over parent baseline</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card highlight-step">
            <span className="step-num">04</span>
            <span className="step-name">Commit / Rollback</span>
            <p className="step-desc">Promote to parent or restore state</p>
          </div>
        </div>
      </div>

      {/* Recent History Snippet */}
      <div className="decision-log-wrap">
        <h4 className="log-heading">Recent Evolution Decisions:</h4>
        <div className="log-table">
          {decisionLog.map((item, idx) => (
            <div key={idx} className="log-row">
              <span className="log-gen">{item.gen}</span>
              <span className={`log-badge badge-${item.status}`}>
                {item.action}
              </span>
              <span className="log-reason">{item.reason}</span>
              <span className="log-delta">{item.delta}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
