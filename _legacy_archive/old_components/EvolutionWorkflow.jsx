import React from 'react';

const PIPELINE_STEPS = [
  { step: 1, name: 'Evaluate Performance' },
  { step: 2, name: 'Detect Performance Issue' },
  { step: 3, name: 'Select Mutation' },
  { step: 4, name: 'Generate New Architecture' },
  { step: 5, name: 'Evaluate New Architecture' },
  { step: 6, name: 'Compare Performance' },
  { step: 7, name: 'Accept / Reject' }
];

export default function EvolutionWorkflow({ activeStep }) {
  return (
    <section id="evolution" className="card">
      <div className="card-header">
        <div className="card-title-wrap">
          <span className="card-icon">⚡</span>
          <div>
            <h2 className="card-title">Autonomous Evolution Cycle Pipeline</h2>
            <div className="card-subtitle">Sense-think-act architecture evolution loop</div>
          </div>
        </div>
      </div>

      <div className="pipeline-track">
        {PIPELINE_STEPS.map((st, idx) => (
          <React.Fragment key={st.step}>
            <div 
              id={`pipe-step-${st.step}`} 
              className={`pipeline-stage-box ${activeStep === st.step ? 'active-stage' : ''}`}
            >
              <span className="stage-number">{st.step < 10 ? `0${st.step}` : st.step}</span>
              <span className="stage-name">{st.name}</span>
            </div>
            {idx < 6 && <span className="pipeline-connector">➔</span>}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
