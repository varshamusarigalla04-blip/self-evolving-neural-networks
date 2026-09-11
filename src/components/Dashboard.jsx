import React, { useState, useEffect } from 'react';

import Navbar from './Navbar.jsx';
import DashboardOverview from './DashboardOverview.jsx';
import ArchitectureMutation from './ArchitectureMutation.jsx';
import NeuralNetwork from './NeuralNetwork.jsx';
import PerformanceMetrics from './PerformanceMetrics.jsx';
import EvolutionDecision from './EvolutionDecision.jsx';
import EvolutionHistory from './EvolutionHistory.jsx';
import ModelComparison from './ModelComparison.jsx';
import ApiKeyPanel from './ApiKeyPanel.jsx';

/**
 * Dashboard Component
 * Clean, structured, premium layout hierarchy:
 * 
 * PROJECT (DashboardOverview)
 *    ↓
 * ARCHITECTURE MUTATION (ArchitectureMutation - at top of neural network area)
 *    ↓
 * NEURAL NETWORK (NeuralNetwork - centered visual focus)
 *    ↓
 * PERFORMANCE (PerformanceMetrics - uniform 8-card grid)
 *    ↓
 * EVOLUTION DECISION (EvolutionDecision - compact 4-field hierarchy + history)
 *    ↓
 * MODEL COMPARISON (ModelComparison - 8 AI models + direct metric-wise graph)
 */
export default function Dashboard({
  // Architecture state
  layers,
  layerNames,
  currentArchitectureStr,
  updatedArchitectureStr,
  selectedMutation,
  onSelectManualMutation,
  
  // Performance metrics
  metrics,
  deltas,
  currentScore,
  newScore,
  thresholdScore,

  // Evolution decision
  decision,
  reason,
  mutationDetails,
  onRunEvolution,
  onResetEvolution,
  isEvolving,
  evolutionStep,
  evolutionHistory,

  // API Session
  sessionKey,
  hasEnvKey,
  onGenerateKey,
  onResetToEnvKey,
  onClearKey,

  // Navigation
  onReturnToWelcome
}) {
  const [activeSection, setActiveSection] = useState('dashboard');

  // Track active section during scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['dashboard-overview', 'architecture-mutation', 'neural-network', 'performance-section', 'evolution-section', 'evolution-history', 'ai-model-comparison'];
      const scrollPos = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          const map = {
            'dashboard-overview': 'dashboard',
            'architecture-mutation': 'architecture',
            'neural-network': 'architecture',
            'performance-section': 'performance',
            'evolution-section': 'evolution',
            'evolution-history': 'history',
            'ai-model-comparison': 'analytics'
          };
          setActiveSection(map[sections[i]] || 'dashboard');
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalNeurons = layers.reduce((a, b) => a + b, 0);
  const hiddenLayerCount = layers.length - 2;

  return (
    <div className="main-dashboard-wrapper">
      {/* Top Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onRunEvolution={onRunEvolution}
        onResetEvolution={onResetEvolution}
        isEvolving={isEvolving}
        onReturnToWelcome={onReturnToWelcome}
        sessionKey={sessionKey}
        hasEnvKey={hasEnvKey}
      />

      <main className="dashboard-sections-container">
        {/* 1. PROJECT (Dashboard Overview & 4 Core Metric Highlights) */}
        <DashboardOverview
          currentScore={currentScore}
          thresholdScore={thresholdScore}
          architectureStr={currentArchitectureStr}
          totalNeurons={totalNeurons}
          hiddenLayerCount={hiddenLayerCount}
          generation={evolutionHistory.length}
          mutationStatus={decision}
          lastMutation={mutationDetails}
          isEvolving={isEvolving}
        />

        {/* 2. ARCHITECTURE MUTATION (Positioned at the top of the neural network section) */}
        <ArchitectureMutation
          currentArchitectureStr={currentArchitectureStr}
          updatedArchitectureStr={updatedArchitectureStr}
          currentScore={currentScore}
          newScore={newScore}
          thresholdScore={thresholdScore}
          mutationDecision={decision}
          selectedMutation={selectedMutation}
          onSelectManualMutation={onSelectManualMutation}
          isEvolving={isEvolving}
        />

        {/* 3. NEURAL NETWORK ARCHITECTURE VISUALIZATION (Visual Focus) */}
        <NeuralNetwork
          layers={layers}
          layerNames={layerNames}
        />

        {/* 4. PERFORMANCE METRICS (Clean, uniform 8-card grid) */}
        <PerformanceMetrics
          metrics={metrics}
          deltas={deltas}
        />

        {/* 5. EVOLUTION DECISION (Compact hierarchy: Performance, Decision, Reason, Mutation) */}
        <EvolutionDecision
          currentPerformance={currentScore}
          mutationName={mutationDetails}
          newPerformance={newScore}
          decision={decision}
          reason={reason}
          threshold={thresholdScore}
          onRunEvolution={onRunEvolution}
          onResetEvolution={onResetEvolution}
          isEvolving={isEvolving}
          evolutionStep={evolutionStep}
        />

        {/* 6. EVOLUTION HISTORY (Audit trail timeline & table) */}
        <EvolutionHistory history={evolutionHistory} />

        {/* 7. MODEL COMPARISON (8 AI Models + Direct Metric-Wise Graph) */}
        <ModelComparison 
          metrics={metrics}
          deltas={deltas}
          currentScore={currentScore}
          newScore={newScore}
          evolutionHistory={evolutionHistory}
        />

        {/* 8. API CONFIGURATION & SESSION SECURITY */}
        <ApiKeyPanel
          sessionKey={sessionKey}
          hasEnvKey={hasEnvKey}
          onGenerateKey={onGenerateKey}
          onResetToEnvKey={onResetToEnvKey}
          onClearKey={onClearKey}
        />
      </main>

      {/* Dashboard Footer */}
      <footer className="dashboard-page-footer">
        <div className="footer-left">
          <span className="footer-project-name font-bold">Self-Evolving Neural Networks</span>
          <span className="footer-project-tag">Performance-Driven Architecture Mutation</span>
        </div>
        <div className="footer-right">
          <span>Autonomous Agentic AI • React.js + Vite</span>
        </div>
      </footer>
    </div>
  );
}
