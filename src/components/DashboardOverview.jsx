import React from 'react';
import { 
  Target, 
  Layers, 
  RefreshCw, 
  GitBranch, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

/**
 * DashboardOverview Component
 * Section 2 of the Redesigned Dashboard:
 * - Project title & short description
 * - 4 Key Status Cards:
 *   1. Current Performance card
 *   2. Current Architecture card
 *   3. Evolution Generation card
 *   4. Mutation Status card
 * - Clean Lucide React icons
 */
export default function DashboardOverview({
  currentScore = 72,
  thresholdScore = 85,
  architectureStr = '[I:4] → [H1:4] → [H2:4] → [O:2]',
  totalNeurons = 14,
  hiddenLayerCount = 2,
  generation = 1,
  mutationStatus = 'ACCEPTED',
  lastMutation = 'Add 2 neurons to Hidden Layer 1',
  isEvolving = false
}) {
  const isAccepted = mutationStatus === 'ACCEPTED';
  const isRejected = mutationStatus === 'REJECTED';
  const thresholdMet = currentScore >= thresholdScore;

  return (
    <section id="dashboard-overview" className="dashboard-overview-container">
      {/* Hero Header Area */}
      <div className="overview-hero-card card">
        <div className="hero-top-badge">
          <Sparkles size={14} className="badge-sparkle-icon" color="#00f0ff" />
          <span>Agentic AI Neural Architecture Search (NAS)</span>
        </div>

        <h1 className="hero-main-title">
          Self-Evolving Neural Networks Using{' '}
          <span className="hero-gradient-text">Performance-Driven Architecture Mutation</span>
        </h1>

        <p className="hero-main-desc">
          An autonomous system that evaluates neural-network accuracy and dynamically decides whether 
          the architecture should evolve through topology mutations—adding or pruning neurons, expanding 
          hidden layers, and rewiring synapses—driven in real time by empirical performance feedback.
        </p>

        <div className="hero-pills-row">
          <span className="hero-pill">Autonomous Control Loop</span>
          <span className="hero-pill">Dynamic Topology Morphing</span>
          <span className="hero-pill">Threshold-Driven Agent</span>
          <span className="hero-pill">Zero Manual Retraining</span>
        </div>
      </div>

      {/* 4 Core Highlight Cards Grid */}
      <div className="overview-cards-grid">
        {/* Card 1: Current Performance */}
        <div className="highlight-stat-card card card-cyan">
          <div className="card-top-indicator">
            <span className="card-icon-bubble">
              <Target size={18} strokeWidth={2.2} color="#00f0ff" />
            </span>
            <span className={`status-pill-mini ${thresholdMet ? 'pill-green' : 'pill-amber'}`}>
              {thresholdMet ? 'Target Met' : 'Under Target'}
            </span>
          </div>
          <div className="card-numeric-val font-mono">{currentScore}%</div>
          <div className="card-label-title">Current Performance</div>
          <div className="card-sub-info">
            Target Threshold: <strong className="font-mono text-cyan">{thresholdScore}%</strong>
          </div>
          <div className="mini-progress-track">
            <div 
              className="mini-progress-fill fill-cyan"
              style={{ width: `${Math.min(100, Math.max(5, (currentScore / 100) * 100))}%` }}
            />
          </div>
        </div>

        {/* Card 2: Current Architecture */}
        <div className="highlight-stat-card card card-purple">
          <div className="card-top-indicator">
            <span className="card-icon-bubble">
              <Layers size={18} strokeWidth={2.2} color="#a855f7" />
            </span>
            <span className="status-pill-mini pill-purple font-mono">{totalNeurons} Neurons</span>
          </div>
          <div className="card-numeric-val font-mono text-purple font-compact">
            {architectureStr.replace(/\[|\]/g, '')}
          </div>
          <div className="card-label-title">Current Architecture</div>
          <div className="card-sub-info">
            {hiddenLayerCount} Hidden Layer{hiddenLayerCount > 1 ? 's' : ''} • Fully Connected
          </div>
          <div className="mini-progress-track">
            <div 
              className="mini-progress-fill fill-purple"
              style={{ width: `${Math.min(100, (totalNeurons / 24) * 100)}%` }}
            />
          </div>
        </div>

        {/* Card 3: Evolution Generation */}
        <div className="highlight-stat-card card card-emerald">
          <div className="card-top-indicator">
            <span className="card-icon-bubble">
              <RefreshCw size={18} strokeWidth={2.2} color="#10b981" />
            </span>
            <span className="status-pill-mini pill-green">Cycle Active</span>
          </div>
          <div className="card-numeric-val font-mono text-emerald">
            Gen #{generation}
          </div>
          <div className="card-label-title">Evolution Generation</div>
          <div className="card-sub-info">
            {generation} Evaluated Mutation Step{generation > 1 ? 's' : ''}
          </div>
          <div className="mini-progress-track">
            <div 
              className="mini-progress-fill fill-emerald"
              style={{ width: `${Math.min(100, (generation / 10) * 100)}%` }}
            />
          </div>
        </div>

        {/* Card 4: Mutation Status */}
        <div className={`highlight-stat-card card ${isAccepted ? 'card-emerald' : isRejected ? 'card-rose' : 'card-amber'}`}>
          <div className="card-top-indicator">
            <span className="card-icon-bubble">
              <GitBranch size={18} strokeWidth={2.2} color={isAccepted ? '#10b981' : isRejected ? '#f43f5e' : '#f59e0b'} />
            </span>
            <span className={`status-pill-mini ${isAccepted ? 'pill-green' : isRejected ? 'pill-rose' : 'pill-cyan'}`}>
              {isEvolving ? 'Evolving...' : mutationStatus}
            </span>
          </div>
          <div className="card-numeric-val font-mono font-compact" style={{ color: isAccepted ? 'var(--accent-emerald)' : isRejected ? 'var(--accent-rose)' : 'var(--accent-cyan)' }}>
            {isEvolving ? 'MUTATING' : mutationStatus}
          </div>
          <div className="card-label-title">Mutation Status</div>
          <div className="card-sub-info text-truncate" title={lastMutation}>
            {lastMutation}
          </div>
          <div className="mini-progress-track">
            <div 
              className={`mini-progress-fill ${isAccepted ? 'fill-emerald' : isRejected ? 'fill-rose' : 'fill-cyan'}`}
              style={{ width: isAccepted ? '100%' : '50%' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
