/**
 * src/services/evolutionEngine.js
 * Performance-Driven Architecture Mutation Engine
 * Implements the 7-stage autonomous agent pipeline
 */

import { AppState } from './state.js';

export const EvolutionEngine = {
  isProcessingStep: false,

  /**
   * Calculates simulated performance score (0 - 100%) for any architecture.
   */
  calculatePerformance(arch) {
    if (!arch) return null;

    const hiddenCount = arch.hidden.length;
    const totalHiddenNeurons = arch.hidden.reduce((sum, n) => sum + n, 0);
    const paramCount = AppState.calculateParamCount(arch);

    let baseScore = 72.0;

    // Depth contribution
    let depthBonus = 0;
    if (hiddenCount === 1) depthBonus = -8.0;
    else if (hiddenCount === 2) depthBonus = 0.0;
    else if (hiddenCount === 3) depthBonus = 4.0;
    else if (hiddenCount === 4) depthBonus = 6.0;
    else depthBonus = 2.0;

    // Neuron width contribution
    const neuronDiff = totalHiddenNeurons - 8;
    let widthBonus = 0;

    if (neuronDiff > 0) {
      if (neuronDiff <= 12) {
        widthBonus = Math.round(neuronDiff * 2.0);
      } else {
        widthBonus = Math.round(24 + (neuronDiff - 12) * 0.4 - (paramCount > 240 ? 5 : 0));
      }
    } else if (neuronDiff < 0) {
      widthBonus = neuronDiff * 4.5;
    }

    // Stochastic variance (+- 0.8%)
    const noise = Math.round((Math.random() - 0.5) * 1.6 * 10) / 10;

    let score = baseScore + depthBonus + widthBonus + noise;
    score = Math.max(35.0, Math.min(96.0, parseFloat(score.toFixed(1))));

    const accuracy = parseFloat(score.toFixed(1));
    const loss = parseFloat(Math.max(0.08, 1.45 - (score / 100) * 1.3).toFixed(2));
    const latency = parseFloat((3.0 + paramCount * 0.08 + hiddenCount * 1.2).toFixed(1));

    return {
      performanceScore: score,
      accuracy,
      loss,
      latency,
      paramCount,
      fitnessScore: score
    };
  },

  diagnoseAndSelectMutation(currentScore, arch, threshold) {
    const hiddenCount = arch.hidden.length;
    const totalNeurons = arch.hidden.reduce((s, n) => s + n, 0);

    let detectedIssue = '';
    let selectedMutation = null;

    if (currentScore < 75) {
      detectedIssue = `Performance (${currentScore}%) below target threshold (${threshold}%). High bias underfitting detected.`;
      if (hiddenCount < 3 && Math.random() < 0.35) {
        selectedMutation = {
          type: 'ADD_LAYER',
          neuronsToAdd: 4,
          layerIndex: hiddenCount,
          shortName: 'Add Layer',
          name: 'Add a Hidden Layer (4 neurons)',
          intent: 'Expanding network depth to resolve complex non-linear boundaries.'
        };
      } else {
        const targetLayer = arch.hidden.indexOf(Math.min(...arch.hidden));
        selectedMutation = {
          type: 'ADD_NEURON',
          neuronsToAdd: 2,
          layerIndex: targetLayer,
          shortName: 'Add Neurons',
          name: `Add 2 Neurons to Hidden ${targetLayer + 1}`,
          intent: 'Increasing layer width to expand representation capacity.'
        };
      }
    } else if (currentScore < threshold) {
      detectedIssue = `Performance (${currentScore}%) below target threshold (${threshold}%). Capacity fine-tuning required.`;
      const rand = Math.random();
      if (rand < 0.65) {
        const targetLayer = arch.hidden.indexOf(Math.min(...arch.hidden));
        selectedMutation = {
          type: 'ADD_NEURON',
          neuronsToAdd: 2,
          layerIndex: targetLayer,
          shortName: 'Add Neurons',
          name: `Add 2 Neurons to Hidden ${targetLayer + 1}`,
          intent: 'Adding neurons to resolve decision boundary.'
        };
      } else if (rand < 0.85 && hiddenCount < AppState.config.maxHiddenLayers) {
        selectedMutation = {
          type: 'ADD_LAYER',
          neuronsToAdd: 4,
          layerIndex: hiddenCount,
          shortName: 'Add Layer',
          name: 'Add a Hidden Layer (4 neurons)',
          intent: 'Deepening network hierarchy.'
        };
      } else {
        const targetLayer = arch.hidden.indexOf(Math.max(...arch.hidden));
        selectedMutation = {
          type: 'REMOVE_NEURON',
          neuronsToRemove: 1,
          layerIndex: targetLayer,
          shortName: 'Remove Neuron',
          name: `Remove 1 Neuron from Hidden ${targetLayer + 1}`,
          intent: 'Testing if network can maintain accuracy with reduced parameter footprint.'
        };
      }
    } else {
      detectedIssue = `Performance (${currentScore}%) meets or exceeds threshold (${threshold}%). Optimal balance reached.`;
      if (totalNeurons > 18) {
        const targetLayer = arch.hidden.indexOf(Math.max(...arch.hidden));
        selectedMutation = {
          type: 'REMOVE_NEURON',
          neuronsToRemove: 1,
          layerIndex: targetLayer,
          shortName: 'Remove Neuron',
          name: `Remove 1 Neuron from Hidden ${targetLayer + 1}`,
          intent: 'Pruning redundant neurons for efficiency.'
        };
      } else {
        selectedMutation = {
          type: 'ADD_NEURON',
          neuronsToAdd: 1,
          layerIndex: 0,
          shortName: 'Add Neuron',
          name: 'Add 1 Neuron to Hidden 1',
          intent: 'Fine-tuning architecture.'
        };
      }
    }

    return { detectedIssue, selectedMutation };
  },

  generateNewArchitecture(arch, mutation) {
    const newArch = AppState.cloneArch(arch);

    switch (mutation.type) {
      case 'ADD_NEURON': {
        const layerIdx = Math.min(mutation.layerIndex, newArch.hidden.length - 1);
        const addCount = mutation.neuronsToAdd || 2;
        newArch.hidden[layerIdx] = Math.min(AppState.config.maxNeuronsPerLayer, newArch.hidden[layerIdx] + addCount);
        break;
      }

      case 'REMOVE_NEURON': {
        const layerIdx = Math.min(mutation.layerIndex, newArch.hidden.length - 1);
        const removeCount = mutation.neuronsToRemove || 1;
        newArch.hidden[layerIdx] = Math.max(AppState.config.minNeuronsPerLayer, newArch.hidden[layerIdx] - removeCount);
        break;
      }

      case 'ADD_LAYER': {
        if (newArch.hidden.length < AppState.config.maxHiddenLayers) {
          newArch.hidden.push(mutation.neuronsToAdd || 4);
        } else {
          newArch.hidden[newArch.hidden.length - 1] += 2;
        }
        break;
      }

      case 'REMOVE_LAYER': {
        if (newArch.hidden.length > AppState.config.minHiddenLayers) {
          newArch.hidden.pop();
        } else {
          newArch.hidden[0] = Math.max(AppState.config.minNeuronsPerLayer, newArch.hidden[0] - 1);
        }
        break;
      }
    }

    return newArch;
  },

  async executeEvolutionCycle(forcedMutation = null) {
    if (this.isProcessingStep) return;
    this.isProcessingStep = true;

    try {
      const stepDelay = Math.max(260, AppState.config.speedMs / 4);

      // STAGE 01: Evaluate Performance
      AppState.activeWorkflowStep = 1;
      AppState.evolutionStatus = 'EVALUATING';
      AppState.notify('workflowStepChanged', 1);

      const oldScore = AppState.metrics.performanceScore;
      const threshold = AppState.config.performanceThreshold;
      const currentArchStr = AppState.getTopologyString(AppState.currentArch);

      AppState.addAgentLog(
        '01: Evaluate',
        'Current Performance Benchmark',
        `Current Performance: ${oldScore}%. Target Threshold: ${threshold}%. Active Architecture: ${currentArchStr}.`,
        'info'
      );
      await this.sleep(stepDelay);

      // STAGE 02: Detect Performance Issue
      AppState.activeWorkflowStep = 2;
      AppState.evolutionStatus = 'DETECTING';
      AppState.notify('workflowStepChanged', 2);

      const diagnosis = this.diagnoseAndSelectMutation(oldScore, AppState.currentArch, threshold);
      AppState.addAgentLog(
        '02: Detect Issue',
        'Diagnostic Telemetry',
        diagnosis.detectedIssue,
        oldScore < threshold ? 'warning' : 'info'
      );
      await this.sleep(stepDelay);

      // STAGE 03: Select Mutation
      AppState.activeWorkflowStep = 3;
      AppState.evolutionStatus = 'MUTATING';
      AppState.notify('workflowStepChanged', 3);

      let selectedMutation = null;
      if (forcedMutation) {
        selectedMutation = {
          type: forcedMutation.type,
          layerIndex: forcedMutation.layerIndex || 0,
          neuronsToAdd: forcedMutation.type === 'ADD_NEURON' ? 2 : (forcedMutation.type === 'ADD_LAYER' ? 4 : 0),
          neuronsToRemove: forcedMutation.type === 'REMOVE_NEURON' ? 1 : 0,
          shortName: forcedMutation.type === 'ADD_NEURON' ? 'Add Neurons' :
                     forcedMutation.type === 'REMOVE_NEURON' ? 'Remove Neuron' :
                     forcedMutation.type === 'ADD_LAYER' ? 'Add Layer' : 'Remove Layer',
          name: forcedMutation.type === 'ADD_NEURON' ? `Add 2 Neurons to Hidden ${(forcedMutation.layerIndex || 0) + 1}` :
                forcedMutation.type === 'REMOVE_NEURON' ? `Remove 1 Neuron from Hidden ${(forcedMutation.layerIndex || 0) + 1}` :
                forcedMutation.type === 'ADD_LAYER' ? 'Add a Hidden Layer (4 neurons)' : 'Remove a Hidden Layer',
          intent: 'Manual operator selected by user.'
        };
      } else {
        selectedMutation = diagnosis.selectedMutation;
      }

      AppState.addAgentLog(
        '03: Select Mutation',
        `Selected: ${selectedMutation.name}`,
        `Agent selected operator: ${selectedMutation.shortName}. Rationale: ${selectedMutation.intent}`,
        'mutation'
      );
      await this.sleep(stepDelay);

      // STAGE 04: Generate New Architecture
      AppState.activeWorkflowStep = 4;
      AppState.notify('workflowStepChanged', 4);

      const candidateArch = this.generateNewArchitecture(AppState.currentArch, selectedMutation);
      AppState.candidateArch = candidateArch;
      const proposedArchStr = AppState.getTopologyString(candidateArch);

      AppState.comparison.currentArchText = currentArchStr;
      AppState.comparison.currentScoreText = `Current: ${oldScore}%`;
      AppState.comparison.proposedArchText = proposedArchStr;
      AppState.comparison.proposedScoreText = 'Proposed: Benchmarking...';
      AppState.comparison.statusBannerText = `Testing candidate: ${selectedMutation.name}`;
      AppState.comparison.statusType = 'ready';

      AppState.notify('candidateGenerated', {
        candidateArch,
        description: selectedMutation.name,
        mutationType: selectedMutation.type
      });

      AppState.addAgentLog(
        '04: Generate Arch',
        'Candidate Architecture Constructed',
        `Generated candidate: ${proposedArchStr}.`,
        'info'
      );
      await this.sleep(stepDelay);

      // STAGE 05: Evaluate New Architecture
      AppState.activeWorkflowStep = 5;
      AppState.evolutionStatus = 'TESTING';
      AppState.notify('workflowStepChanged', 5);

      const candidateMetrics = this.calculatePerformance(candidateArch);
      const newScore = candidateMetrics.performanceScore;
      AppState.comparison.proposedScoreText = `Proposed: ${newScore}%`;

      AppState.addAgentLog(
        '05: Evaluate New Arch',
        'Candidate Evaluated',
        `Candidate ${proposedArchStr} achieved simulated performance score: ${newScore}%.`,
        'info'
      );
      await this.sleep(stepDelay);

      // STAGE 06: Compare Performance
      AppState.activeWorkflowStep = 6;
      AppState.evolutionStatus = 'COMPARING';
      AppState.notify('workflowStepChanged', 6);

      const delta = parseFloat((newScore - oldScore).toFixed(1));
      const deltaFormatted = delta > 0 ? `+${delta}%` : `${delta}%`;

      AppState.addAgentLog(
        '06: Compare',
        'Differential Benchmark',
        `Current: ${oldScore}% vs Proposed: ${newScore}% (Delta: ${deltaFormatted}).`,
        'info'
      );
      await this.sleep(stepDelay);

      // STAGE 07: Accept / Reject
      AppState.activeWorkflowStep = 7;
      AppState.notify('workflowStepChanged', 7);

      const isImproved = newScore > oldScore;
      AppState.generation += 1;
      AppState.totalMutations += 1;

      let decisionReason = '';

      if (isImproved) {
        AppState.acceptedMutations += 1;
        AppState.evolutionStatus = 'ACCEPTED';
        decisionReason = 'The new architecture achieved better simulated performance than the previous architecture.';

        if (newScore > AppState.bestPerformanceScore) {
          AppState.bestPerformanceScore = newScore;
        }

        AppState.latestDecision = {
          currentPerformance: `${oldScore}%`,
          detectedIssue: diagnosis.detectedIssue,
          selectedMutation: selectedMutation.shortName,
          newArchitecture: proposedArchStr,
          newPerformance: `${newScore}%`,
          finalDecision: '✓ MUTATION ACCEPTED',
          reason: decisionReason
        };

        AppState.comparison.statusBannerText = '✓ IMPROVED — MUTATION ACCEPTED';
        AppState.comparison.statusType = 'accepted';

        AppState.addAgentLog(
          '07: Decision',
          'MUTATION ACCEPTED',
          `Decision: ✓ MUTATION ACCEPTED. Performance rose from ${oldScore}% to ${newScore}% (${deltaFormatted}).`,
          'success'
        );

        AppState.recordHistory(
          AppState.generation,
          candidateArch,
          selectedMutation.shortName,
          newScore,
          'Accepted',
          `Improved by ${deltaFormatted}. Adopted as active architecture.`
        );

        AppState.currentArch = AppState.cloneArch(candidateArch);
        AppState.metrics = candidateMetrics;
        AppState.candidateArch = null;

        AppState.recordTrend(
          AppState.generation,
          newScore,
          candidateMetrics.accuracy,
          candidateMetrics.loss
        );
      } else {
        AppState.rejectedMutations += 1;
        AppState.evolutionStatus = 'REJECTED';
        decisionReason = 'The candidate architecture did not achieve better performance. Retained previous architecture.';

        AppState.latestDecision = {
          currentPerformance: `${oldScore}%`,
          detectedIssue: diagnosis.detectedIssue,
          selectedMutation: selectedMutation.shortName,
          newArchitecture: proposedArchStr,
          newPerformance: `${newScore}%`,
          finalDecision: '✗ MUTATION REJECTED',
          reason: decisionReason
        };

        AppState.comparison.statusBannerText = '✗ NOT IMPROVED — MUTATION REJECTED';
        AppState.comparison.statusType = 'rejected';

        AppState.addAgentLog(
          '07: Decision',
          'MUTATION REJECTED',
          `Decision: ✗ MUTATION REJECTED. Score (${newScore}%) was not greater than baseline (${oldScore}%). Candidate discarded.`,
          'reject'
        );

        AppState.recordHistory(
          AppState.generation,
          candidateArch,
          selectedMutation.shortName,
          newScore,
          'Rejected',
          `Score dropped or stayed equal (${newScore}% vs ${oldScore}%). Discarded.`
        );

        AppState.candidateArch = null;
      }

      AppState.notify('cycleCompleted', {
        isAccepted: isImproved,
        latestDecision: AppState.latestDecision,
        comparison: AppState.comparison,
        metrics: AppState.metrics
      });
      await this.sleep(stepDelay);

      if (AppState.metrics.performanceScore >= threshold) {
        AppState.evolutionStatus = 'CONVERGED';
        AppState.config.autoRunning = false;
        AppState.addAgentLog(
          'Target Achieved',
          'Convergence Satisfied',
          `Target performance reached (${AppState.metrics.performanceScore}% >= ${threshold}%). System converged!`,
          'success'
        );
      }

      await this.sleep(stepDelay / 2);
      AppState.activeWorkflowStep = 0;
      AppState.notify('workflowStepChanged', 0);

    } finally {
      this.isProcessingStep = false;
    }
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

if (typeof window !== 'undefined') {
  window.EvolutionEngine = EvolutionEngine;
}

export default EvolutionEngine;
