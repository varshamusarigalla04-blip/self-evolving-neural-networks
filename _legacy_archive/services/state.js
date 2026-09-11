/**
 * src/services/state.js
 * Centralized Reactive State for Self-Evolving Neural Networks
 */

export const AppState = {
  currentArch: {
    input: 4,
    hidden: [4, 4],
    output: 2
  },

  candidateArch: null,

  metrics: {
    performanceScore: 72.0,
    accuracy: 72.0,
    loss: 0.54,
    latency: 8.4,
    paramCount: 46,
    fitnessScore: 72.0
  },

  bestPerformanceScore: 72.0,

  config: {
    performanceThreshold: 85,
    autoRunning: false,
    speedMs: 1200,
    minNeuronsPerLayer: 2,
    maxNeuronsPerLayer: 16,
    minHiddenLayers: 1,
    maxHiddenLayers: 4
  },

  comparison: {
    currentArchText: 'Input → 4 → 4 → Output',
    currentScoreText: 'Current: 72%',
    proposedArchText: 'Awaiting Mutation...',
    proposedScoreText: 'Proposed: ---',
    statusBannerText: 'System ready. Click "Run Evolution" to generate architecture mutation.',
    statusType: 'ready'
  },

  latestDecision: {
    currentPerformance: '72%',
    detectedIssue: 'Performance below target threshold (72% < 85%).',
    selectedMutation: 'None yet',
    newArchitecture: 'Input → 4 → 4 → Output',
    newPerformance: '---',
    finalDecision: 'READY',
    reason: 'The baseline architecture is initialized. Evolution agent is standing by.'
  },

  generation: 1,
  totalMutations: 0,
  acceptedMutations: 0,
  rejectedMutations: 0,
  evolutionStatus: 'IDLE',
  activeWorkflowStep: 0,

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

  agentLogs: [],

  trendData: {
    generations: [1],
    fitnessScores: [72.0],
    accuracies: [72.0],
    losses: [0.54]
  },

  listeners: [],

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
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

  getTopologyString(arch = this.currentArch) {
    if (!arch) return "N/A";
    return `Input → ${arch.hidden.join(" → ")} → Output`;
  },

  getArchDashNotation(arch = this.currentArch) {
    if (!arch) return "N/A";
    return arch.hidden.join("-");
  },

  getDetailedTopologyString(arch = this.currentArch) {
    if (!arch) return "N/A";
    const hiddenParts = arch.hidden.map((n, idx) => `Hidden ${idx + 1} (${n})`);
    return `Input (${arch.input}) → ${hiddenParts.join(" → ")} → Output (${arch.output})`;
  },

  cloneArch(arch = this.currentArch) {
    return {
      input: arch.input,
      hidden: [...arch.hidden],
      output: arch.output
    };
  },

  addAgentLog(stage, title, message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp,
      generation: this.generation,
      stage,
      title,
      message,
      type
    };
    this.agentLogs.unshift(logEntry);
    if (this.agentLogs.length > 50) this.agentLogs.pop();
    this.notify('agentLogAdded', logEntry);
  },

  recordHistory(genNum, arch, mutationType, performance, decision, detail) {
    const entry = {
      generation: genNum < 10 ? `0${genNum}` : `${genNum}`,
      archStr: this.getArchDashNotation(arch),
      mutationType,
      performance: `${performance}%`,
      decision,
      detail,
      timestamp: new Date().toLocaleTimeString()
    };
    this.history.unshift(entry);
    this.notify('historyUpdated', entry);
  },

  recordTrend(gen, fitness, acc, loss) {
    this.trendData.generations.push(gen);
    this.trendData.fitnessScores.push(parseFloat(fitness.toFixed(1)));
    this.trendData.accuracies.push(parseFloat(acc.toFixed(1)));
    this.trendData.losses.push(parseFloat(loss.toFixed(2)));
    this.notify('trendUpdated', this.trendData);
  },

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

if (typeof window !== 'undefined') {
  window.AppState = AppState;
}

export default AppState;
