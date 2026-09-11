/**
 * state.js - Centralized Reactive State for Self-Evolving Neural Networks
 * Tracks active topology, candidate topology, telemetry metrics, 7-stage workflow,
 * agent decisions, Before vs. After comparisons, and history log.
 */

const AppState = {
  // Baseline Architecture: Input (4) → Hidden (4) → Hidden (4) → Output (2)
  currentArch: {
    input: 4,
    hidden: [4, 4],
    output: 2
  },

  // Candidate Architecture during mutation testing
  candidateArch: null,

  // Performance Metrics (Simulated Prototype Values)
  metrics: {
    performanceScore: 72.0, // percentage (Starts at 72.0%)
    accuracy: 72.0,         // percentage
    loss: 0.54,             // cross-entropy loss
    latency: 8.4,           // simulated inference latency in ms
    paramCount: 46,         // total weights + biases
    fitnessScore: 72.0
  },

  // Historical Peak Performance
  bestPerformanceScore: 72.0,

  // Predefined Performance Threshold for the Agent
  config: {
    performanceThreshold: 85, // When performance < 85%, agent triggers mutation
    autoRunning: false,
    speedMs: 1200,            // delay per evolution step
    minNeuronsPerLayer: 2,
    maxNeuronsPerLayer: 16,
    minHiddenLayers: 1,
    maxHiddenLayers: 4
  },

  // Before vs After Architecture Comparison Card State
  comparison: {
    currentArchText: 'Input → 4 → 4 → Output',
    currentScoreText: 'Current: 72%',
    proposedArchText: 'Awaiting Mutation...',
    proposedScoreText: 'Proposed: ---',
    statusBannerText: 'System ready. Click "Run Evolution" to generate architecture mutation.',
    statusType: 'ready' // 'ready' | 'accepted' | 'rejected'
  },

  // Latest Agent Decision Object (Matching exact 7 fields)
  latestDecision: {
    currentPerformance: '72%',
    detectedIssue: 'Performance below target threshold (72% < 85%).',
    selectedMutation: 'None yet',
    newArchitecture: 'Input → 4 → 4 → Output',
    newPerformance: '---',
    finalDecision: 'READY', // 'ACCEPTED' | 'REJECTED' | 'READY'
    reason: 'The baseline architecture is initialized. Evolution agent is standing by.'
  },

  // Evolution Telemetry Stats
  generation: 1,
  totalMutations: 0,
  acceptedMutations: 0,
  rejectedMutations: 0,
  evolutionStatus: 'IDLE', // 'IDLE' | 'EVALUATING' | 'DETECTING' | 'MUTATING' | 'TESTING' | 'COMPARING' | 'ACCEPTED' | 'REJECTED' | 'CONVERGED'

  // 7-Stage Workflow Pipeline (0 = none, 1 to 7 = active stage)
  // 01: Evaluate Performance
  // 02: Detect Performance Issue
  // 03: Select Mutation
  // 04: Generate New Architecture
  // 05: Evaluate New Architecture
  // 06: Compare Performance
  // 07: Accept / Reject
  activeWorkflowStep: 0,

  // Evolution History Log
  history: [
    {
      generation: '01',
      archStr: '4-4',
      mutationType: 'Initial Baseline',
      performance: '72%',
      decision: '—',
      detail: 'Starting baseline architecture deployed for classification task.',
      timestamp: new Date().toLocaleTimeString()
    }
  ],

  // Agent Diagnostic Reasoning Logs
  agentLogs: [],

  // Performance Trend Data (for canvas chart)
  trendData: {
    generations: [1],
    fitnessScores: [72.0],
    accuracies: [72.0],
    losses: [0.54]
  },

  // Observer Listeners
  listeners: [],

  subscribe(callback) {
    this.listeners.push(callback);
  },

  notify(event, payload) {
    this.listeners.forEach(cb => {
      try {
        cb(event, payload, this);
      } catch (err) {
        console.error("Error in state callback:", err);
      }
    });
  },

  // Calculate Parameter Count (Weights + Biases)
  calculateParamCount(arch) {
    if (!arch) return 0;
    let total = 0;
    const layers = [arch.input, ...arch.hidden, arch.output];
    for (let i = 0; i < layers.length - 1; i++) {
      const weights = layers[i] * layers[i + 1];
      const biases = layers[i + 1];
      total += (weights + biases);
    }
    return total;
  },

  // Compact Topology String e.g. "Input → 4 → 4 → Output"
  getTopologyString(arch = this.currentArch) {
    if (!arch) return "N/A";
    return `Input → ${arch.hidden.join(" → ")} → Output`;
  },

  // Shorthand dash notation e.g. "4-4" or "4-6-4"
  getArchDashNotation(arch = this.currentArch) {
    if (!arch) return "N/A";
    return arch.hidden.join("-");
  },

  // Detailed layer topology string e.g. "Input (4) → Hidden 1 (4) → Hidden 2 (4) → Output (2)"
  getDetailedTopologyString(arch = this.currentArch) {
    if (!arch) return "N/A";
    const hiddenParts = arch.hidden.map((n, idx) => `Hidden ${idx + 1} (${n})`);
    return `Input (${arch.input}) → ${hiddenParts.join(" → ")} → Output (${arch.output})`;
  },

  // Clone Architecture Object safely
  cloneArch(arch = this.currentArch) {
    return {
      input: arch.input,
      hidden: [...arch.hidden],
      output: arch.output
    };
  },

  // Add an entry to the agent reasoning log
  addAgentLog(stage, title, message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp,
      generation: this.generation,
      stage,
      title,
      message,
      type // 'info', 'success', 'warning', 'mutation', 'reject'
    };
    this.agentLogs.unshift(logEntry);
    if (this.agentLogs.length > 50) this.agentLogs.pop();
    this.notify('agentLogAdded', logEntry);
  },

  // Record generation snapshot in Evolution History
  recordHistory(genNum, arch, mutationType, performance, decision, detail) {
    const entry = {
      generation: genNum < 10 ? `0${genNum}` : `${genNum}`,
      archStr: this.getArchDashNotation(arch),
      mutationType,
      performance: `${performance}%`,
      decision, // 'Accepted' | 'Rejected' | '—'
      detail,
      timestamp: new Date().toLocaleTimeString()
    };
    this.history.unshift(entry);
    this.notify('historyUpdated', entry);
  },

  // Record trend point for chart
  recordTrend(gen, fitness, acc, loss) {
    this.trendData.generations.push(gen);
    this.trendData.fitnessScores.push(parseFloat(fitness.toFixed(1)));
    this.trendData.accuracies.push(parseFloat(acc.toFixed(1)));
    this.trendData.losses.push(parseFloat(loss.toFixed(2)));
    this.notify('trendUpdated', this.trendData);
  },

  // Reset entire state to initial baseline
  resetToInitial() {
    this.currentArch = {
      input: 4,
      hidden: [4, 4],
      output: 2
    };
    this.candidateArch = null;
    this.metrics = {
      performanceScore: 72.0,
      accuracy: 72.0,
      loss: 0.54,
      latency: 8.4,
      paramCount: this.calculateParamCount(this.currentArch),
      fitnessScore: 72.0
    };
    this.bestPerformanceScore = 72.0;
    this.generation = 1;
    this.totalMutations = 0;
    this.acceptedMutations = 0;
    this.rejectedMutations = 0;
    this.evolutionStatus = 'IDLE';
    this.activeWorkflowStep = 0;

    this.comparison = {
      currentArchText: 'Input → 4 → 4 → Output',
      currentScoreText: 'Current: 72%',
      proposedArchText: 'Awaiting Mutation...',
      proposedScoreText: 'Proposed: ---',
      statusBannerText: 'System reset to baseline. Click "Run Evolution" to generate architecture mutation.',
      statusType: 'ready'
    };

    this.latestDecision = {
      currentPerformance: '72%',
      detectedIssue: 'Performance below target threshold (72% < 85%).',
      selectedMutation: 'None yet',
      newArchitecture: 'Input → 4 → 4 → Output',
      newPerformance: '---',
      finalDecision: 'READY',
      reason: 'The baseline architecture is initialized. Evolution agent is standing by.'
    };

    this.history = [
      {
        generation: '01',
        archStr: '4-4',
        mutationType: 'Initial Baseline',
        performance: '72%',
        decision: '—',
        detail: 'Starting baseline architecture deployed for classification task.',
        timestamp: new Date().toLocaleTimeString()
      }
    ];

    this.agentLogs = [];
    this.trendData = {
      generations: [1],
      fitnessScores: [72.0],
      accuracies: [72.0],
      losses: [0.54]
    };
    this.config.autoRunning = false;

    this.addAgentLog(
      'System Init',
      'Architecture Initialized',
      'Starting architecture: Input (4) → Hidden (4) → Hidden (4) → Output (2). Initial simulated performance: 72.0%.',
      'info'
    );

    this.notify('stateReset', this);
  }
};

window.AppState = AppState;
