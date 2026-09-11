/**
 * app.js - UI Controller & Application Orchestrator
 * Binds the redesigned dashboard, 4 metric cards, 7-stage evolution pipeline,
 * Before vs. After comparison, Quick Status sidebar, Agent Decision monitoring,
 * and 10-second animation controls.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Visualizer and AI Model Variation Analytics Dashboard
  const visualizer = new NetworkVisualizer('networkCanvas');
  const analyticsEngine = new ModelVariationAnalytics();

  // DOM Elements - AI Model Analytics Filter Controls
  const modelCheckboxes = document.querySelectorAll('#modelCheckboxContainer input[type="checkbox"]');
  const btnSelectAll = document.getElementById('btnSelectAllModels');
  const btnDeselectAll = document.getElementById('btnDeselectAllModels');
  const metricSelectDropdown = document.getElementById('metricSelectDropdown');

  // Checkbox toggle handler
  modelCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const modelId = e.target.getAttribute('data-model');
      if (analyticsEngine) analyticsEngine.toggleModel(modelId, e.target.checked);
    });
  });

  // Select All button
  if (btnSelectAll) {
    btnSelectAll.addEventListener('click', () => {
      modelCheckboxes.forEach(cb => { cb.checked = true; });
      if (analyticsEngine) analyticsEngine.setAllModels(true);
    });
  }

  // Deselect All button
  if (btnDeselectAll) {
    btnDeselectAll.addEventListener('click', () => {
      modelCheckboxes.forEach(cb => { cb.checked = false; });
      if (analyticsEngine) analyticsEngine.setAllModels(false);
    });
  }

  // Metric dropdown for Graph 2
  if (metricSelectDropdown) {
    metricSelectDropdown.addEventListener('change', (e) => {
      if (analyticsEngine) analyticsEngine.setMetric(e.target.value);
    });
  }

  // DOM Elements - Hero & Quick Status
  const elHeroStatusText = document.getElementById('heroStatusText');
  const elQuickStatusVal = document.getElementById('quickStatusVal');
  const elQuickGenVal = document.getElementById('quickGenVal');
  const elQuickMutationsVal = document.getElementById('quickMutationsVal');
  const elQuickBestScoreVal = document.getElementById('quickBestScoreVal');
  const elQuickAnimVal = document.getElementById('quickAnimVal');

  // DOM Elements - 4 Performance Overview Metric Cards
  const elPerfScoreVal = document.getElementById('perfScoreVal');
  const elPerfScoreBar = document.getElementById('perfScoreBar');
  const elAccuracyVal = document.getElementById('accuracyVal');
  const elAccuracyBar = document.getElementById('accuracyBar');
  const elLossVal = document.getElementById('lossVal');
  const elLossBar = document.getElementById('lossBar');
  const elGenerationVal = document.getElementById('generationVal');

  // DOM Elements - 7 Pipeline Stage Boxes
  const pipelineStepElements = {
    1: document.getElementById('pipe-step-1'),
    2: document.getElementById('pipe-step-2'),
    3: document.getElementById('pipe-step-3'),
    4: document.getElementById('pipe-step-4'),
    5: document.getElementById('pipe-step-5'),
    6: document.getElementById('pipe-step-6'),
    7: document.getElementById('pipe-step-7')
  };


  // DOM Elements - Agent Decision Panel (7 Fields)
  const elAgentCurrentPerf = document.getElementById('agentCurrentPerf');
  const elAgentDetectedIssue = document.getElementById('agentDetectedIssue');
  const elAgentSelectedMutation = document.getElementById('agentSelectedMutation');
  const elAgentNewArch = document.getElementById('agentNewArch');
  const elAgentNewPerf = document.getElementById('agentNewPerf');
  const elAgentDecisionBadge = document.getElementById('agentDecisionBadge');
  const elAgentReasonText = document.getElementById('agentReasonText');
  const elAgentDecisionLogs = document.getElementById('agentDecisionLogs');

  // DOM Elements - Mutation Controls
  const btnAddNeuron = document.getElementById('btnAddNeuron');
  const btnRemoveNeuron = document.getElementById('btnRemoveNeuron');
  const btnAddLayer = document.getElementById('btnAddLayer');
  const btnRemoveLayer = document.getElementById('btnRemoveLayer');
  const btnRunEvolution = document.getElementById('btnRunEvolution');
  const btnAutoRun = document.getElementById('btnAutoRun');
  const btnReset = document.getElementById('btnReset');
  const selectSpeed = document.getElementById('selectSpeed');
  const sliderTargetFitness = document.getElementById('sliderTargetFitness');
  const elTargetFitnessVal = document.getElementById('targetFitnessVal');

  // History Elements
  const elHistoryTableBody = document.getElementById('historyTableBody');
  const elEmptyHistoryNotice = document.getElementById('emptyHistoryNotice');

  // Animation Controls
  const btnReplayAnimation = document.getElementById('btnReplayAnimation');

  /**
   * UI Rendering Functions
   */
  function updateDashboardUI() {
    const m = AppState.metrics;
    const currentScore = m.performanceScore.toFixed(1);

    // 4 Performance Cards
    if (elPerfScoreVal) elPerfScoreVal.textContent = `${currentScore}%`;
    if (elPerfScoreBar) elPerfScoreBar.style.width = `${Math.min(100, Math.max(5, m.performanceScore))}%`;

    if (elAccuracyVal) elAccuracyVal.textContent = `${m.accuracy.toFixed(1)}%`;
    if (elAccuracyBar) elAccuracyBar.style.width = `${Math.min(100, Math.max(5, m.accuracy))}%`;

    if (elLossVal) elLossVal.textContent = m.loss.toFixed(2);
    if (elLossBar) elLossBar.style.width = `${Math.min(100, Math.max(5, (1.5 - m.loss) * 66))}%`;

    const genStr = AppState.generation < 10 ? `0${AppState.generation}` : `${AppState.generation}`;
    if (elGenerationVal) elGenerationVal.textContent = genStr;

    // Quick Telemetry Sidebar
    if (elQuickGenVal) elQuickGenVal.textContent = genStr;
    const mutStr = AppState.totalMutations < 10 ? `0${AppState.totalMutations}` : `${AppState.totalMutations}`;
    if (elQuickMutationsVal) elQuickMutationsVal.textContent = mutStr;
    if (elQuickBestScoreVal) elQuickBestScoreVal.textContent = `${AppState.bestPerformanceScore.toFixed(1)}%`;

    // System Status
    const statusText = AppState.evolutionStatus;
    if (elQuickStatusVal) {
      elQuickStatusVal.textContent = `● ${statusText}`;
      if (statusText === 'ACCEPTED' || statusText === 'CONVERGED' || statusText === 'IDLE') {
        elQuickStatusVal.style.color = 'var(--accent-emerald)';
      } else if (statusText === 'REJECTED') {
        elQuickStatusVal.style.color = 'var(--accent-rose)';
      } else {
        elQuickStatusVal.style.color = 'var(--accent-cyan-light)';
      }
    }

    if (elHeroStatusText) {
      if (statusText === 'IDLE') elHeroStatusText.textContent = 'Evolution System Ready';
      else if (statusText === 'CONVERGED') elHeroStatusText.textContent = 'Evolution Converged — Target Reached';
      else elHeroStatusText.textContent = `Evolution Status: ${statusText}`;
    }

    // Update Agent Decision Panel
    updateAgentDecisionUI();
  }

  function updateAgentDecisionUI() {
    const d = AppState.latestDecision;
    if (!d) return;

    if (elAgentCurrentPerf) elAgentCurrentPerf.textContent = d.currentPerformance;
    if (elAgentDetectedIssue) elAgentDetectedIssue.textContent = d.detectedIssue;
    if (elAgentSelectedMutation) elAgentSelectedMutation.textContent = d.selectedMutation;
    if (elAgentNewArch) elAgentNewArch.textContent = d.newArchitecture;
    if (elAgentNewPerf) elAgentNewPerf.textContent = d.newPerformance;
    if (elAgentReasonText) elAgentReasonText.textContent = d.reason;

    if (elAgentDecisionBadge) {
      elAgentDecisionBadge.textContent = d.finalDecision;
      if (d.finalDecision.includes('ACCEPTED')) {
        elAgentDecisionBadge.className = 'decision-badge-pill accepted';
      } else if (d.finalDecision.includes('REJECTED')) {
        elAgentDecisionBadge.className = 'decision-badge-pill rejected';
      } else {
        elAgentDecisionBadge.className = 'decision-badge-pill ready';
      }
    }
  }

  function updatePipelineStage(activeStep) {
    for (let i = 1; i <= 7; i++) {
      const el = pipelineStepElements[i];
      if (!el) continue;
      if (i === activeStep) {
        el.classList.add('active-stage');
      } else {
        el.classList.remove('active-stage');
      }
    }
  }

  function renderHistoryTable() {
    if (!elHistoryTableBody) return;
    elHistoryTableBody.innerHTML = '';

    if (AppState.history.length === 0) {
      if (elEmptyHistoryNotice) elEmptyHistoryNotice.style.display = 'block';
      return;
    }
    if (elEmptyHistoryNotice) elEmptyHistoryNotice.style.display = 'none';

    AppState.history.forEach((row) => {
      const tr = document.createElement('tr');
      let badgeClass = 'initial';
      if (row.decision === 'Accepted') badgeClass = 'accepted';
      else if (row.decision === 'Rejected') badgeClass = 'rejected';

      tr.innerHTML = `
        <td class="col-gen">Gen ${row.generation}</td>
        <td class="col-arch">${row.archStr}</td>
        <td style="color: #fff; font-weight: 600;">${row.mutationType}</td>
        <td style="color: var(--accent-cyan-light); font-weight: 700; font-family: var(--font-mono);">${row.performance}</td>
        <td><span class="badge-decision ${badgeClass}">${row.decision}</span></td>
        <td style="color: var(--text-secondary); font-size: 0.8rem;">${row.detail}</td>
      `;
      elHistoryTableBody.appendChild(tr);
    });
  }

  function renderAgentLogs() {
    if (!elAgentDecisionLogs) return;
    elAgentDecisionLogs.innerHTML = '';

    if (AppState.agentLogs.length === 0) {
      elAgentDecisionLogs.innerHTML = '<div style="color: var(--text-muted); font-size: 0.78rem; text-align: center; padding: 16px;">Agent ready. Telemetry logs will stream here during evolution.</div>';
      return;
    }

    AppState.agentLogs.slice(0, 20).forEach(log => {
      const item = document.createElement('div');
      item.className = `log-item type-${log.type}`;
      item.innerHTML = `
        <div class="log-item-header">
          <span class="log-item-stage">${log.stage} &bull; ${log.title}</span>
          <span>${log.timestamp}</span>
        </div>
        <div class="log-item-msg">${log.message}</div>
      `;
      elAgentDecisionLogs.appendChild(item);
    });
  }

  /**
   * Monitor Animation State for Quick Sidebar
   */
  setInterval(() => {
    if (elQuickAnimVal && visualizer) {
      elQuickAnimVal.textContent = visualizer.isAnimating ? 'Running' : 'Paused';
      elQuickAnimVal.style.color = visualizer.isAnimating ? 'var(--accent-emerald)' : 'var(--text-secondary)';
    }
  }, 300);

  /**
   * Auto Evolution Loop
   */
  let autoRunTimer = null;

  async function runAutoEvolutionLoop() {
    if (!AppState.config.autoRunning) return;

    if (AppState.metrics.performanceScore >= AppState.config.performanceThreshold) {
      toggleAutoRun(false);
      return;
    }

    await EvolutionEngine.executeEvolutionCycle();

    if (AppState.config.autoRunning) {
      autoRunTimer = setTimeout(runAutoEvolutionLoop, 350);
    }
  }

  function toggleAutoRun(forceState) {
    const newState = forceState !== undefined ? forceState : !AppState.config.autoRunning;
    AppState.config.autoRunning = newState;

    if (btnAutoRun) {
      if (newState) {
        btnAutoRun.innerHTML = '<span>⏸ Pause Loop</span>';
        btnAutoRun.classList.add('btn-running');
      } else {
        btnAutoRun.innerHTML = '<span>🔁 Auto Evolve</span>';
        btnAutoRun.classList.remove('btn-running');
      }
    }

    if (newState) {
      runAutoEvolutionLoop();
    } else {
      if (autoRunTimer) clearTimeout(autoRunTimer);
    }
  }

  /**
   * State Subscriptions
   */
  AppState.subscribe((event, payload) => {
    switch (event) {
      case 'workflowStepChanged':
        updatePipelineStage(payload);
        updateDashboardUI();
        break;

      case 'candidateGenerated':
        visualizer.rebuildGraph();
        visualizer.startAnimation(10000);
        break;

      case 'cycleCompleted':
        updateDashboardUI();
        visualizer.rebuildGraph();
        renderHistoryTable();
        break;

      case 'agentLogAdded':
        renderAgentLogs();
        break;

      case 'trendUpdated':
        break;

      case 'stateReset':
        updateDashboardUI();
        visualizer.rebuildGraph();
        visualizer.startAnimation(10000);
        renderHistoryTable();
        renderAgentLogs();
        updatePipelineStage(0);
        break;
    }
  });

  // Replay Animation Button (Runs exactly 10 seconds then stops)
  if (btnReplayAnimation) {
    btnReplayAnimation.addEventListener('click', () => {
      visualizer.replayAnimation();
    });
  }

  // Primary Button: Run Evolution
  if (btnRunEvolution) {
    btnRunEvolution.addEventListener('click', async () => {
      if (EvolutionEngine.isProcessingStep) return;
      if (AppState.config.autoRunning) toggleAutoRun(false);

      btnRunEvolution.disabled = true;
      btnRunEvolution.innerHTML = '<span>⚡ Running Cycle...</span>';
      await EvolutionEngine.executeEvolutionCycle();
      btnRunEvolution.disabled = false;
      btnRunEvolution.innerHTML = '<span>▶ Run Evolution</span>';
    });
  }

  // Button: Auto Evolve
  if (btnAutoRun) {
    btnAutoRun.addEventListener('click', () => {
      toggleAutoRun();
    });
  }

  // Button: Reset System
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      toggleAutoRun(false);
      AppState.resetToInitial();
    });
  }

  // Speed Selector
  if (selectSpeed) {
    selectSpeed.addEventListener('change', (e) => {
      AppState.config.speedMs = parseInt(e.target.value, 10);
    });
  }

  // Target Slider
  if (sliderTargetFitness) {
    sliderTargetFitness.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      AppState.config.performanceThreshold = val;
      if (elTargetFitnessVal) elTargetFitnessVal.textContent = val;
    });
  }

  // 4 Mutation Action Buttons
  const handleManualMutation = async (type) => {
    if (EvolutionEngine.isProcessingStep) return;
    if (AppState.config.autoRunning) toggleAutoRun(false);
    await EvolutionEngine.executeEvolutionCycle({ type, layerIndex: 0 });
  };

  if (btnAddNeuron) btnAddNeuron.addEventListener('click', () => handleManualMutation('ADD_NEURON'));
  if (btnRemoveNeuron) btnRemoveNeuron.addEventListener('click', () => handleManualMutation('REMOVE_NEURON'));
  if (btnAddLayer) btnAddLayer.addEventListener('click', () => handleManualMutation('ADD_LAYER'));
  if (btnRemoveLayer) btnRemoveLayer.addEventListener('click', () => handleManualMutation('REMOVE_LAYER'));

  // Preset Demonstration Scenarios
  const scenarioButtons = document.querySelectorAll('[data-scenario]');
  scenarioButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleAutoRun(false);
      const scenario = btn.getAttribute('data-scenario');
      loadDemoScenario(scenario);
    });
  });

  function loadDemoScenario(scenario) {
    if (scenario === 'underfitting') {
      AppState.currentArch = { input: 4, hidden: [2], output: 2 };
      AppState.metrics = {
        performanceScore: 48.0,
        accuracy: 48.0,
        loss: 0.92,
        latency: 4.8,
        paramCount: AppState.calculateParamCount(AppState.currentArch),
        fitnessScore: 48.0
      };
      AppState.bestPerformanceScore = 48.0;
      AppState.generation = 1;
      AppState.comparison = {
        currentArchText: 'Input → 2 → Output',
        currentScoreText: 'Current: 48%',
        proposedArchText: 'Awaiting Mutation...',
        proposedScoreText: 'Proposed: ---',
        statusBannerText: 'Underfitting demo loaded. Score: 48%. Deepening & widening required.',
        statusType: 'ready'
      };
      AppState.latestDecision = {
        currentPerformance: '48%',
        detectedIssue: 'Severe high bias underfitting detected (48% < 85%).',
        selectedMutation: 'None yet',
        newArchitecture: 'Input → 2 → Output',
        newPerformance: '---',
        finalDecision: 'READY',
        reason: 'Network has insufficient parameters to separate non-linear features.'
      };
      AppState.addAgentLog(
        'Scenario',
        'Severe Underfitting Loaded',
        'Loaded minimal network [Input → 2 → Output] at 48% score. Ready for mutation.',
        'warning'
      );
    } else if (scenario === 'bloat') {
      AppState.currentArch = { input: 4, hidden: [16, 16, 14], output: 2 };
      AppState.metrics = {
        performanceScore: 88.0,
        accuracy: 92.0,
        loss: 0.18,
        latency: 38.6,
        paramCount: AppState.calculateParamCount(AppState.currentArch),
        fitnessScore: 88.0
      };
      AppState.bestPerformanceScore = 88.0;
      AppState.generation = 1;
      AppState.comparison = {
        currentArchText: 'Input → 16 → 16 → 14 → Output',
        currentScoreText: 'Current: 88%',
        proposedArchText: 'Awaiting Mutation...',
        proposedScoreText: 'Proposed: ---',
        statusBannerText: 'Over-parameterization demo loaded. High latency (38.6ms). Ready for pruning.',
        statusType: 'ready'
      };
      AppState.latestDecision = {
        currentPerformance: '88%',
        detectedIssue: 'Inference latency penalty detected due to redundant parameters.',
        selectedMutation: 'None yet',
        newArchitecture: 'Input → 16 → 16 → 14 → Output',
        newPerformance: '---',
        finalDecision: 'READY',
        reason: 'Oversized architecture. Agent will explore pruning.'
      };
      AppState.addAgentLog(
        'Scenario',
        'Over-Parameterization Loaded',
        'Loaded bulky network [16-16-14]. Ready to test pruning.',
        'warning'
      );
    } else if (scenario === 'balanced') {
      AppState.resetToInitial();
      return;
    }

    AppState.candidateArch = null;
    AppState.activeWorkflowStep = 0;
    updateDashboardUI();
    visualizer.rebuildGraph();
    visualizer.startAnimation(10000);
    renderHistoryTable();
    renderAgentLogs();
  }

  // Top Navbar Scroll Spy
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 130;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });

  // Initial Boot
  AppState.resetToInitial();
  renderHistoryTable();
});
