import React from 'react';
import { 
  Workflow, 
  BarChart2, 
  Search, 
  Dna, 
  FlaskConical, 
  ArrowLeftRight, 
  CheckCheck,
  ArrowRight
} from 'lucide-react';

/**
 * EvolutionWorkflow Component
 * Prominently visualizes the 6-step Agentic Decision Loop:
 * 1. Evaluate Performance
 * 2. Identify Problem
 * 3. Select Mutation
 * 4. Test New Architecture
 * 5. Compare Performance
 * 6. Accept / Reject
 * 
 * Uses Lucide React icons.
 */
export default function EvolutionWorkflow({ isEvolving = false, currentStep = '' }) {
  const steps = [
    {
      num: '01',
      title: 'Evaluate Performance',
      desc: 'Benchmarks accuracy and loss against the 85% predefined threshold.',
      icon: <BarChart2 size={18} strokeWidth={2} color="#00f0ff" />,
      keyMatch: 'Evaluating'
    },
    {
      num: '02',
      title: 'Identify Problem',
      desc: 'Detects representation bottlenecks, underfitting, or capacity plateau.',
      icon: <Search size={18} strokeWidth={2} color="#38bdf8" />,
      keyMatch: 'Analyzing'
    },
    {
      num: '03',
      title: 'Select Mutation',
      desc: 'Chooses suitable operator: Add/Remove Neurons or Add/Remove Layers.',
      icon: <Dna size={18} strokeWidth={2} color="#a855f7" />,
      keyMatch: 'Selecting'
    },
    {
      num: '04',
      title: 'Test New Architecture',
      desc: 'Generates candidate topology and evaluates simulated score.',
      icon: <FlaskConical size={18} strokeWidth={2} color="#f59e0b" />,
      keyMatch: 'Testing'
    },
    {
      num: '05',
      title: 'Compare Performance',
      desc: 'Compares candidate score against the current baseline performance.',
      icon: <ArrowLeftRight size={18} strokeWidth={2} color="#38bdf8" />,
      keyMatch: 'Comparing'
    },
    {
      num: '06',
      title: 'Accept / Reject',
      desc: 'Keeps new architecture if improved; otherwise retains previous model.',
      icon: <CheckCheck size={18} strokeWidth={2} color="#10b981" />,
      keyMatch: 'complete'
    }
  ];

  return (
    <section id="evolution-section" className="dashboard-section card evolution-workflow-card">
      <div className="section-header-row">
        <div className="section-title-wrap">
          <div className="section-icon-badge icon-purple">
            <Workflow size={20} strokeWidth={2} color="#a855f7" />
          </div>
          <div>
            <h2 className="section-heading">AGENTIC EVOLUTION PIPELINE</h2>
            <p className="section-subheading">
              6-Step Performance-Driven Architecture Mutation Workflow
            </p>
          </div>
        </div>

        <div className="workflow-status-badge">
          <span className={`status-dot ${isEvolving ? 'pulse-anim' : ''}`} />
          <span className="font-mono">{isEvolving ? (currentStep || 'Agent Executing Loop...') : 'Pipeline Ready'}</span>
        </div>
      </div>

      {/* 6-Step Loop Chain */}
      <div className="workflow-steps-chain">
        {steps.map((step, idx) => {
          const isActive = isEvolving && currentStep.toLowerCase().includes(step.keyMatch.toLowerCase());
          return (
            <React.Fragment key={step.num}>
              <div className={`workflow-step-node ${isActive ? 'step-active-pulse' : ''}`}>
                <div className="step-node-top">
                  <span className="step-number font-mono">{step.num}</span>
                  <span className="step-icon-lucide">{step.icon}</span>
                </div>
                <h4 className="step-title">{step.title}</h4>
                <p className="step-description">{step.desc}</p>
                {isActive && <div className="step-active-glow" />}
              </div>

              {idx < steps.length - 1 && (
                <div className="workflow-connector">
                  <ArrowRight size={14} strokeWidth={2} className="connector-arrow-lucide" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
