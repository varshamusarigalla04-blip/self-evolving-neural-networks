import React from 'react';
import { 
  CheckCircle2, 
  RotateCcw, 
  Play, 
  Loader2, 
  Check, 
  X, 
  ShieldCheck,
  Dna,
  Target,
  ArrowRight,
  Workflow
} from 'lucide-react';

/**
 * EvolutionDecision Component
 * Compact hierarchy:
 * 1. Performance (e.g. 72.0% / 85% target)
 * 2. Decision (MUTATE / ACCEPTED / REJECTED)
 * 3. Reason (Performance threshold not achieved / etc.)
 * 4. Mutation (Added 2 neurons to Hidden Layer 1)
 * 
 * Includes 6-step agentic loop progression during evolution.
 */
export default function EvolutionDecision({
  currentPerformance = 72,
  mutationName = 'Add 2 neurons to Hidden Layer 1',
  newPerformance = 76,
  decision = 'ACCEPTED', // 'ACCEPTED' | 'REJECTED' | 'MUTATE'
  reason = 'Performance threshold not achieved. Expanding capacity to improve accuracy.',
  threshold = 85,
  isEvolving = false,
  evolutionStep = '',
  onRunEvolution,
  onResetEvolution
}) {
  const isAccepted = decision === 'ACCEPTED';
  const isRejected = decision === 'REJECTED';
  const isMutate = decision === 'MUTATE' || (!isAccepted && !isRejected);

  // Workflow steps for the compact agent loop indicator
  const workflowSteps = [
    { num: '1', name: 'Evaluate', key: 'evaluating' },
    { num: '2', name: 'Identify', key: 'analyzing' },
    { num: '3', name: 'Select', key: 'selecting' },
    { num: '4', name: 'Test', key: 'testing' },
    { num: '5', name: 'Compare', key: 'comparing' },
    { num: '6', name: 'Decide', key: 'complete' }
  ];

  return (
    <section id="evolution-section" className="dashboard-section card decision-section-card">
      {/* Header & Controls */}
      <div className="section-header-row">
        <div className="section-title-wrap">
          <div className="section-icon-badge icon-amber">
            <CheckCircle2 size={18} strokeWidth={2.2} color="#f59e0b" />
          </div>
          <div>
            <h2 className="section-heading">EVOLUTION DECISION</h2>
            <p className="section-subheading">
              Autonomous performance evaluation &amp; architecture mutation verdict
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="decision-actions-group">
          <button 
            id="btn-reset-evolution"
            className="btn btn-secondary btn-sm"
            onClick={onResetEvolution}
            title="Reset to initial baseline architecture (72% performance)"
            disabled={isEvolving}
          >
            <RotateCcw size={13} strokeWidth={2} />
            <span>Reset</span>
          </button>

          <button 
            id="btn-run-evolution"
            className={`btn btn-primary btn-run-evolution ${isEvolving ? 'running' : ''}`}
            onClick={onRunEvolution}
            disabled={isEvolving}
          >
            {isEvolving ? (
              <Loader2 size={14} className="spin-icon" strokeWidth={2.5} />
            ) : (
              <Play size={13} strokeWidth={2.5} />
            )}
            <span className="font-mono">
              {isEvolving ? (evolutionStep || 'Evolving Architecture...') : 'RUN EVOLUTION'}
            </span>
          </button>
        </div>
      </div>

      {/* Compact 4-Point Hierarchy Grid */}
      <div className="decision-compact-grid">
        {/* 1. Performance */}
        <div className="decision-tile tile-perf">
          <span className="tile-label font-mono">Performance</span>
          <div className="tile-value-group">
            <span className="tile-main-val font-mono text-cyan">{currentPerformance}%</span>
            <span className="tile-sub font-mono">Target: {threshold}%</span>
          </div>
          <div className="tile-bar-track">
            <div 
              className="tile-bar-fill fill-cyan"
              style={{ width: `${Math.min(100, currentPerformance)}%` }}
            />
          </div>
        </div>

        {/* 2. Decision */}
        <div className={`decision-tile tile-decision ${isAccepted ? 'tile-accepted' : isRejected ? 'tile-rejected' : 'tile-mutate'}`}>
          <span className="tile-label font-mono">Decision</span>
          <div className="tile-value-group">
            <span className={`decision-verdict-pill ${isAccepted ? 'badge-accepted' : isRejected ? 'badge-rejected' : 'badge-mutate'}`}>
              {isAccepted ? (
                <>
                  <Check size={13} strokeWidth={2.5} /> ACCEPTED
                </>
              ) : isRejected ? (
                <>
                  <X size={13} strokeWidth={2.5} /> REJECTED
                </>
              ) : (
                <>
                  <Dna size={13} strokeWidth={2.5} /> MUTATE
                </>
              )}
            </span>
          </div>
          <span className="tile-sub font-mono">
            {isAccepted ? 'Keep New Architecture' : isRejected ? 'Retain Baseline' : 'Evolving Topology'}
          </span>
        </div>

        {/* 3. Reason */}
        <div className="decision-tile tile-reason">
          <span className="tile-label font-mono">Reason</span>
          <p className="tile-text-reason">
            {reason || (currentPerformance < threshold
              ? `Performance (${currentPerformance}%) is below the ${threshold}% target threshold. Selected topological capacity adjustment.`
              : `Performance (${currentPerformance}%) satisfies the ${threshold}% threshold. Optimal topology achieved.`)}
          </p>
        </div>

        {/* 4. Mutation */}
        <div className="decision-tile tile-mutation">
          <span className="tile-label font-mono">Mutation</span>
          <div className="tile-mutation-name text-purple font-mono">
            {mutationName}
          </div>
          <span className="tile-sub font-mono text-emerald">
            Projected Score: {newPerformance}%
          </span>
        </div>
      </div>

      {/* Integrated 6-Step Agent Loop Progression Strip */}
      <div className="workflow-progression-strip">
        <span className="workflow-strip-label font-mono">
          <Workflow size={13} strokeWidth={2} /> AGENT LOOP:
        </span>
        <div className="workflow-mini-chain">
          {workflowSteps.map((step, idx) => {
            const isActive = isEvolving && evolutionStep.toLowerCase().includes(step.key);
            return (
              <React.Fragment key={step.num}>
                <span className={`workflow-mini-step ${isActive ? 'mini-active' : ''}`}>
                  <span className="mini-num">{step.num}</span>
                  <span className="mini-name">{step.name}</span>
                </span>
                {idx < workflowSteps.length - 1 && (
                  <ArrowRight size={11} strokeWidth={2} className="workflow-arrow-sep" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
