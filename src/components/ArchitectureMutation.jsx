import React from 'react';
import { 
  Dna, 
  PlusCircle, 
  MinusCircle, 
  Layers, 
  Minimize2, 
  ArrowRight,
  Activity,
  GitBranch,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

/**
 * ArchitectureMutation Component
 * Positioned AT THE TOP of the neural-network area.
 * Compact, visually clear format:
 * Current Architecture → Performance Evaluation → Mutation Decision → Mutation Applied → Updated Architecture
 * 
 * 4 Mutation Operators available in a compact selector strip:
 * 1. Add neurons to a hidden layer
 * 2. Remove neurons from a hidden layer
 * 3. Add a hidden layer
 * 4. Remove a hidden layer
 */
export default function ArchitectureMutation({ 
  currentArchitectureStr, 
  updatedArchitectureStr,
  currentScore = 72,
  newScore = 76,
  thresholdScore = 85,
  mutationDecision = 'ACCEPTED',
  selectedMutation,
  onSelectManualMutation,
  isEvolving = false
}) {
  const mutationCatalog = [
    {
      id: 'add_neurons',
      name: 'Add Neurons',
      category: 'Width Expansion',
      icon: <PlusCircle size={15} strokeWidth={2} color="#00f0ff" />,
      desc: '+1 or 2 neurons to hidden layer',
      badge: 'Capacity'
    },
    {
      id: 'remove_neurons',
      name: 'Remove Neurons',
      category: 'Pruning & Sparsity',
      icon: <MinusCircle size={15} strokeWidth={2} color="#f43f5e" />,
      desc: 'Prune redundant nodes',
      badge: 'Sparsity'
    },
    {
      id: 'add_hidden_layer',
      name: 'Add Hidden Layer',
      category: 'Depth Expansion',
      icon: <Layers size={15} strokeWidth={2} color="#a855f7" />,
      desc: 'Insert intermediate layer',
      badge: 'Depth'
    },
    {
      id: 'remove_hidden_layer',
      name: 'Remove Hidden Layer',
      category: 'Depth Reduction',
      icon: <Minimize2 size={15} strokeWidth={2} color="#f59e0b" />,
      desc: 'Prune underutilized layer',
      badge: 'Efficiency'
    }
  ];

  const isAccepted = mutationDecision === 'ACCEPTED';
  const isRejected = mutationDecision === 'REJECTED';

  return (
    <section id="architecture-mutation" className="dashboard-section card mutation-pipeline-card">
      {/* Section Header */}
      <div className="section-header-row">
        <div className="section-title-wrap">
          <div className="section-icon-badge icon-purple">
            <Dna size={18} strokeWidth={2.2} color="#a855f7" />
          </div>
          <div>
            <h2 className="section-heading">ARCHITECTURE MUTATION</h2>
            <p className="section-subheading">
              Current Architecture → Performance Evaluation → Mutation Decision → Mutation Applied → Updated Architecture
            </p>
          </div>
        </div>

        <div className="mutation-status-pill">
          <span className={`status-dot ${isEvolving ? 'pulse-anim' : ''}`} />
          <span>{isEvolving ? 'Evaluating Topology...' : 'Agentic Engine Ready'}</span>
        </div>
      </div>

      {/* 5-Step Compact Pipeline Flow */}
      <div className="pipeline-flow-container">
        {/* Step 1: Current Architecture */}
        <div className="pipeline-step-box step-current">
          <div className="step-badge-num font-mono">STEP 1</div>
          <h4 className="step-title">Current Architecture</h4>
          <div className="step-badge-val font-mono">{currentArchitectureStr}</div>
          <span className="step-hint">Baseline topology</span>
        </div>

        <div className="pipeline-connector-arrow">
          <ArrowRight size={15} strokeWidth={2.2} />
        </div>

        {/* Step 2: Performance Evaluation */}
        <div className="pipeline-step-box step-eval">
          <div className="step-badge-num font-mono">STEP 2</div>
          <h4 className="step-title">Performance Evaluation</h4>
          <div className="step-badge-val text-cyan font-mono">
            {currentScore}% <span className="threshold-sub">/ {thresholdScore}% target</span>
          </div>
          <span className="step-hint">
            {currentScore < thresholdScore ? 'Improvement Required' : 'Threshold Achieved'}
          </span>
        </div>

        <div className="pipeline-connector-arrow">
          <ArrowRight size={15} strokeWidth={2.2} />
        </div>

        {/* Step 3: Mutation Decision */}
        <div className={`pipeline-step-box step-decision ${isAccepted ? 'highlight-mutate' : isRejected ? 'highlight-rejected' : ''}`}>
          <div className="step-badge-num font-mono">STEP 3</div>
          <h4 className="step-title">Mutation Decision</h4>
          <div className="step-badge-val font-mono" style={{ color: isAccepted ? 'var(--accent-emerald)' : isRejected ? 'var(--accent-rose)' : 'var(--accent-cyan)' }}>
            {mutationDecision}
          </div>
          <span className="step-hint">
            {isAccepted ? 'Keep New Architecture' : isRejected ? 'Retain Previous Architecture' : 'Optimal Architecture'}
          </span>
        </div>

        <div className="pipeline-connector-arrow">
          <ArrowRight size={15} strokeWidth={2.2} />
        </div>

        {/* Step 4: Mutation Applied */}
        <div className="pipeline-step-box step-applied highlight-applied">
          <div className="step-badge-num font-mono">STEP 4</div>
          <h4 className="step-title">Mutation Applied</h4>
          <div className="step-badge-val text-purple font-mono">
            {selectedMutation?.name || 'Add Neurons'}
          </div>
          <span className="step-hint">{selectedMutation?.category || 'Topology Mutation'}</span>
        </div>

        <div className="pipeline-connector-arrow">
          <ArrowRight size={15} strokeWidth={2.2} />
        </div>

        {/* Step 5: Updated Architecture */}
        <div className="pipeline-step-box step-updated">
          <div className="step-badge-num font-mono">STEP 5</div>
          <h4 className="step-title">Updated Architecture</h4>
          <div className="step-badge-val text-emerald font-mono">{updatedArchitectureStr}</div>
          <span className="step-hint">
            {isAccepted ? `Active Score: ${newScore}%` : `Retained Score: ${currentScore}%`}
          </span>
        </div>
      </div>

      {/* Compact Operator Selector Strip */}
      <div className="mutation-compact-strip">
        <span className="strip-label font-mono">MUTATION OPERATORS:</span>
        <div className="operators-pills-row">
          {mutationCatalog.map((mut) => {
            const isSelected = selectedMutation?.id === mut.id;
            return (
              <button 
                key={mut.id}
                type="button"
                className={`operator-pill-btn ${isSelected ? 'selected-operator' : ''}`}
                onClick={() => onSelectManualMutation && onSelectManualMutation(mut)}
                title={mut.desc}
              >
                <span className="op-icon">{mut.icon}</span>
                <span className="op-name">{mut.name}</span>
                <span className="op-badge font-mono">{mut.badge}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
