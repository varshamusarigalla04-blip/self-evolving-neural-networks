import React, { useState, useEffect } from 'react';
import './App.css';

import WelcomePage from './components/WelcomePage.jsx';
import Dashboard from './components/Dashboard.jsx';
import { 
  ENV_API_KEY, 
  formatApiKey, 
  maskApiKey, 
  generateEphemeralKey,
  checkServerBackendStatus,
  requestServerEvolution
} from './utils/apiKey.js';

/**
 * App Component
 * 
 * Implements the performance-driven architecture mutation logic:
 * - Starts with: Input Layer (4) → Hidden Layer 1 (4) → Hidden Layer 2 (4) → Output Layer (2)
 * - Initial simulated performance: 72%
 * - Predefined target threshold: 85%
 * - Evaluates performance against threshold
 * - Agent selects one of 4 mutations:
 *   1. Add neurons to a hidden layer
 *   2. Remove neurons from a hidden layer
 *   3. Add a hidden layer
 *   4. Remove a hidden layer
 * - Compares old vs candidate performance
 * - Keeps new architecture ONLY if performance improves (ACCEPTED)
 * - Rejects mutation and retains previous architecture if it degrades (REJECTED)
 * - Records every mutation in Evolution History
 * - Displays decisions in simple language
 */
export default function App() {
  // Navigation View: 'welcome' | 'dashboard'
  const [view, setView] = useState('welcome');

  // Initial Architecture: Input (4) → Hidden 1 (4) → Hidden 2 (4) → Output (2)
  const [layers, setLayers] = useState([4, 4, 4, 2]);
  const [layerNames, setLayerNames] = useState([
    'Input Layer (4)',
    'Hidden Layer 1 (4)',
    'Hidden Layer 2 (4)',
    'Output Layer (2)'
  ]);

  // Performance Scores (starts at 72%, target threshold 85%)
  const [currentScore, setCurrentScore] = useState(72);
  const [newScore, setNewScore] = useState(76);
  const thresholdScore = 85;

  // Decision & Reason State in Simple Language
  const [decision, setDecision] = useState('ACCEPTED');
  const [reason, setReason] = useState('New architecture improved the performance.');
  const [mutationDetails, setMutationDetails] = useState('Add 2 neurons to Hidden Layer 1');
  
  // Selected Mutation Catalog Card
  const [selectedMutation, setSelectedMutation] = useState({
    id: 'add_neurons',
    name: 'Add Neurons to Hidden Layer',
    category: 'Width Expansion'
  });

  // Evolution Cycle Execution State
  const [isEvolving, setIsEvolving] = useState(false);
  const [evolutionStep, setEvolutionStep] = useState('');

  // Evolution History Log
  const [evolutionHistory, setEvolutionHistory] = useState([
    {
      id: 1,
      generation: 1,
      currentPerf: '68%',
      mutation: 'Initial Baseline Setup',
      newPerf: '72%',
      decision: 'ACCEPTED',
      reason: 'Baseline model initialized. Accuracy below 85% target threshold.',
      architecture: '[I:4] → [H1:4] → [H2:4] → [O:2]',
      timestamp: 'Initial Seed'
    }
  ]);

  // Telemetry Metrics (derived consistently from currentScore)
  const calculateMetrics = (score, layerArr) => ({
    accuracy: score,
    precision: +(score - 0.6).toFixed(1),
    recall: +(score + 0.8).toFixed(1),
    f1Score: +score.toFixed(1),
    loss: Math.max(0.08, +(0.75 - score * 0.006).toFixed(3)),
    performanceScore: score,
    neuronCount: layerArr.reduce((a, b) => a + b, 0),
    hiddenLayerCount: layerArr.length - 2
  });

  const [metrics, setMetrics] = useState(calculateMetrics(72, [4, 4, 4, 2]));
  const [deltas, setDeltas] = useState({
    accuracy: '+4.0%',
    precision: '+3.8%',
    recall: '+4.2%',
    f1Score: '+4.0%',
    loss: '-0.035',
    performanceScore: '+4.0%',
    neuronCount: '+2',
    hiddenLayerCount: '0'
  });

  // API Session Key initialized from .env (if present) or ephemeral memory
  const [sessionKey, setSessionKey] = useState(ENV_API_KEY ? formatApiKey(ENV_API_KEY) : null);
  const [hasServerKey, setHasServerKey] = useState(false);

  // Check Vercel serverless backend status on application load
  useEffect(() => {
    let isMounted = true;
    checkServerBackendStatus().then((status) => {
      if (isMounted) {
        setHasServerKey(Boolean(status.hasServerKey));
        if (status.hasServerKey && !sessionKey) {
          setSessionKey('sk-evolve-serverless-vault-active');
        }
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Helper formatting for architecture string
  const formatArchitectureStr = (layerArr) => {
    const hiddenStrs = layerArr
      .slice(1, -1)
      .map((n, i) => `[H${i + 1}:${n}]`)
      .join(' → ');
    return `[I:${layerArr[0]}] → ${hiddenStrs} → [O:${layerArr[layerArr.length - 1]}]`;
  };

  const currentArchitectureStr = formatArchitectureStr(layers);
  const updatedArchitectureStr = formatArchitectureStr(
    decision === 'ACCEPTED'
      ? layers
      : [layers[0], layers[1] + 2, ...layers.slice(2)]
  );

  /**
   * Reset Evolution to the Baseline Architecture & 72% Performance
   */
  const handleResetEvolution = () => {
    const resetLayers = [4, 4, 4, 2];
    setLayers(resetLayers);
    setLayerNames([
      'Input Layer (4)',
      'Hidden Layer 1 (4)',
      'Hidden Layer 2 (4)',
      'Output Layer (2)'
    ]);
    setCurrentScore(72);
    setNewScore(72);
    setDecision('ACCEPTED');
    setReason('Reset to initial baseline architecture (4 → 4 → 4 → 2).');
    setMutationDetails('Initial Baseline Setup');
    setSelectedMutation({
      id: 'add_neurons',
      name: 'Add Neurons to Hidden Layer',
      category: 'Width Expansion'
    });
    setMetrics(calculateMetrics(72, resetLayers));
    setDeltas({
      accuracy: '0.0%',
      precision: '0.0%',
      recall: '0.0%',
      f1Score: '0.0%',
      loss: '0.000',
      performanceScore: '0.0%',
      neuronCount: '0',
      hiddenLayerCount: '0'
    });
    setEvolutionHistory([
      {
        id: 1,
        generation: 1,
        currentPerf: '68%',
        mutation: 'Initial Baseline Reset',
        newPerf: '72%',
        decision: 'ACCEPTED',
        reason: 'Reset to initial baseline architecture. Performance below 85% threshold.',
        architecture: '[I:4] → [H1:4] → [H2:4] → [O:2]',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  /**
   * RUN EVOLUTION - Agentic Mutation Decision Loop
   */
  const handleRunEvolution = () => {
    if (isEvolving) return;
    setIsEvolving(true);

    const oldPerf = currentScore;

    // Step 1: Evaluate current performance
    setEvolutionStep(`Evaluating Current Performance (${oldPerf}% vs ${thresholdScore}% target)...`);

    setTimeout(() => {
      // Check if threshold is already met
      if (oldPerf >= thresholdScore) {
        setEvolutionStep('Target threshold achieved. Stabilizing architecture...');
        setDecision('THRESHOLD MET');
        setReason(`Current performance (${oldPerf}%) meets or exceeds the target threshold (${thresholdScore}%). Architecture is optimal.`);
        setMutationDetails('No mutation required (Stabilized)');
        setNewScore(oldPerf);

        // Record in history
        setEvolutionHistory((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            generation: prev.length + 1,
            currentPerf: `${oldPerf}%`,
            mutation: 'None (Threshold Met)',
            newPerf: `${oldPerf}%`,
            decision: 'STABILIZED',
            reason: `Target performance (${thresholdScore}%) met. Architecture stabilized.`,
            architecture: currentArchitectureStr,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);

        setIsEvolving(false);
        return;
      }

      // Step 2: Performance is below threshold -> Agent selects a mutation
      setEvolutionStep('Performance below threshold. Agent evaluating mutation...');

      setTimeout(async () => {
        // Query Vercel serverless backend if active
        let serverRes = null;
        try {
          serverRes = await requestServerEvolution({
            currentScore: oldPerf,
            thresholdScore,
            layers,
            generation: evolutionHistory.length + 1
          });
        } catch (e) {
          serverRes = null;
        }

        // Decide which of the 4 mutations to execute (local heuristic baseline)
        const numHidden = layers.length - 2;
        const availableMutations = ['add_neurons'];

        // Can remove neurons if any hidden layer has > 2 neurons
        if (layers[1] > 2 || (layers[2] && layers[2] > 2)) {
          availableMutations.push('remove_neurons');
        }
        // Can add a hidden layer if < 4 hidden layers
        if (numHidden < 3) {
          availableMutations.push('add_hidden_layer');
        }
        // Can remove a hidden layer if > 1 hidden layer
        if (numHidden > 1) {
          availableMutations.push('remove_hidden_layer');
        }

        // Weighted selection: prioritize adding neurons when performance is low
        let chosenType = 'add_neurons';
        const rand = Math.random();
        if (oldPerf < 78) {
          // Low performance: strongly favor expansion
          chosenType = rand < 0.7 ? 'add_neurons' : (availableMutations.includes('add_hidden_layer') ? 'add_hidden_layer' : 'add_neurons');
        } else {
          // Mid-to-high performance: explore pruning and adjustments
          if (rand < 0.5) chosenType = 'add_neurons';
          else if (rand < 0.75 && availableMutations.includes('remove_neurons')) chosenType = 'remove_neurons';
          else if (rand < 0.9 && availableMutations.includes('add_hidden_layer')) chosenType = 'add_hidden_layer';
          else if (availableMutations.includes('remove_hidden_layer')) chosenType = 'remove_hidden_layer';
          else chosenType = 'add_neurons';
        }

        // Generate candidate architecture & mutation description
        let candidateLayers = [...layers];
        let mutDesc = '';
        let delta = 0;
        let selectedMutObj = { id: chosenType, name: '', category: '' };

        if (chosenType === 'add_neurons') {
          // Pick hidden layer 1 or hidden layer 2
          const targetHiddenIdx = (candidateLayers[1] <= candidateLayers[2] || numHidden === 1) ? 1 : 2;
          const neuronsToAdd = Math.random() > 0.4 ? 2 : 1;
          candidateLayers[targetHiddenIdx] += neuronsToAdd;
          mutDesc = `Add ${neuronsToAdd} neuron${neuronsToAdd > 1 ? 's' : ''} to Hidden Layer ${targetHiddenIdx}`;
          selectedMutObj = {
            id: 'add_neurons',
            name: `Add ${neuronsToAdd} Neurons (Layer ${targetHiddenIdx})`,
            category: 'Width Expansion'
          };
          delta = Math.random() < 0.75 ? (Math.floor(Math.random() * 4) + 2) : -(Math.floor(Math.random() * 2) + 1);
        } else if (chosenType === 'remove_neurons') {
          const targetHiddenIdx = (candidateLayers[1] >= candidateLayers[2]) ? 1 : 2;
          candidateLayers[targetHiddenIdx] = Math.max(2, candidateLayers[targetHiddenIdx] - 1);
          mutDesc = `Remove 1 neuron from Hidden Layer ${targetHiddenIdx}`;
          selectedMutObj = {
            id: 'remove_neurons',
            name: `Remove 1 Neuron (Layer ${targetHiddenIdx})`,
            category: 'Pruning & Sparsity'
          };
          delta = Math.random() < 0.4 ? (Math.floor(Math.random() * 3) + 1) : -(Math.floor(Math.random() * 3) + 2);
        } else if (chosenType === 'add_hidden_layer') {
          const newHiddenIdx = candidateLayers.length - 1;
          candidateLayers.splice(newHiddenIdx, 0, 3);
          mutDesc = `Add Hidden Layer ${numHidden + 1} (3 neurons)`;
          selectedMutObj = {
            id: 'add_hidden_layer',
            name: `Add Hidden Layer ${numHidden + 1}`,
            category: 'Depth Expansion'
          };
          delta = Math.random() < 0.7 ? (Math.floor(Math.random() * 4) + 3) : -(Math.floor(Math.random() * 2) + 1);
        } else if (chosenType === 'remove_hidden_layer') {
          candidateLayers.splice(candidateLayers.length - 2, 1);
          mutDesc = `Remove Hidden Layer ${numHidden}`;
          selectedMutObj = {
            id: 'remove_hidden_layer',
            name: `Remove Hidden Layer ${numHidden}`,
            category: 'Depth Reduction'
          };
          delta = Math.random() < 0.35 ? (Math.floor(Math.random() * 3) + 1) : -(Math.floor(Math.random() * 4) + 2);
        }

        // Overwrite with serverless decision if serverless API returned a response
        let candidatePerf = Math.min(96, Math.max(60, oldPerf + delta));
        if (serverRes && serverRes.success && Array.isArray(serverRes.candidateLayers)) {
          candidateLayers = serverRes.candidateLayers;
          mutDesc = serverRes.mutationDetails;
          selectedMutObj = {
            id: serverRes.mutationType,
            name: serverRes.mutationDetails,
            category: serverRes.mutationCategory || 'Topology Morphing'
          };
          candidatePerf = serverRes.newScore;
        }

        setEvolutionStep(`Testing candidate: ${mutDesc} → Score: ${candidatePerf}%...`);

        setTimeout(() => {
          // Step 3: Compare old and new performance
          const isImprovement = serverRes ? (serverRes.decision === 'ACCEPTED') : (candidatePerf > oldPerf);
          const newDecision = serverRes ? serverRes.decision : (isImprovement ? 'ACCEPTED' : 'REJECTED');
          const newReasonText = serverRes ? serverRes.reason : (isImprovement ? 'New architecture improved the performance.' : 'New architecture decreased performance. Mutation rejected.');

          if (isImprovement) {
            setLayers(candidateLayers);
            setCurrentScore(candidatePerf);
            setNewScore(candidatePerf);
            setDecision(newDecision);
            setReason(newReasonText);
            setMutationDetails(mutDesc);
            setSelectedMutation(selectedMutObj);

            // Update layer names
            const newLayerNames = [
              `Input Layer (${candidateLayers[0]})`,
              ...candidateLayers.slice(1, -1).map((n, i) => `Hidden Layer ${i + 1} (${n})`),
              `Output Layer (${candidateLayers[candidateLayers.length - 1]})`
            ];
            setLayerNames(newLayerNames);

            // Update metrics
            setMetrics(calculateMetrics(candidatePerf, candidateLayers));
            setDeltas({
              accuracy: `+${(candidatePerf - oldPerf).toFixed(1)}%`,
              precision: `+${(candidatePerf - oldPerf).toFixed(1)}%`,
              recall: `+${(candidatePerf - oldPerf).toFixed(1)}%`,
              f1Score: `+${(candidatePerf - oldPerf).toFixed(1)}%`,
              loss: `-${(delta * 0.006).toFixed(3)}`,
              performanceScore: `+${(candidatePerf - oldPerf).toFixed(1)}%`,
              neuronCount: `${candidateLayers.reduce((a, b) => a + b, 0) - layers.reduce((a, b) => a + b, 0) >= 0 ? '+' : ''}${candidateLayers.reduce((a, b) => a + b, 0) - layers.reduce((a, b) => a + b, 0)}`,
              hiddenLayerCount: `${candidateLayers.length - layers.length >= 0 ? '+' : ''}${candidateLayers.length - layers.length}`
            });

            // Record in Evolution History
            setEvolutionHistory((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                generation: prev.length + 1,
                currentPerf: `${oldPerf}%`,
                mutation: mutDesc,
                newPerf: `${candidatePerf}%`,
                decision: 'ACCEPTED',
                reason: newReasonText,
                architecture: formatArchitectureStr(candidateLayers),
                timestamp: new Date().toLocaleTimeString()
              }
            ]);
          } else {
            // REJECTED: Retain previous architecture!
            const newDecision = 'REJECTED';
            const newReasonText = `New architecture did not improve performance (${candidatePerf}% vs ${oldPerf}%). Retaining previous architecture.`;

            // Retain previous layers and score!
            setNewScore(candidatePerf);
            setDecision(newDecision);
            setReason(newReasonText);
            setMutationDetails(mutDesc);
            setSelectedMutation(selectedMutObj);

            // Record in Evolution History
            setEvolutionHistory((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                generation: prev.length + 1,
                currentPerf: `${oldPerf}%`,
                mutation: mutDesc,
                newPerf: `${candidatePerf}%`,
                decision: 'REJECTED',
                reason: newReasonText,
                architecture: currentArchitectureStr,
                timestamp: new Date().toLocaleTimeString()
              }
            ]);
          }

          setEvolutionStep('Cycle finished.');
          setIsEvolving(false);
        }, 700);
      }, 700);
    }, 600);
  };

  /**
   * Session Key Handlers (Using .env Configuration & Cryptographic Generation)
   */
  const handleGenerateKey = () => {
    setSessionKey(generateEphemeralKey());
  };

  const handleResetToEnvKey = () => {
    setSessionKey(ENV_API_KEY ? formatApiKey(ENV_API_KEY) : null);
  };

  const handleClearKey = () => {
    setSessionKey(null);
  };

  return (
    <div className="app-root-shell">
      {view === 'welcome' ? (
        <WelcomePage onEnterDashboard={() => setView('dashboard')} />
      ) : (
        <Dashboard
          layers={layers}
          layerNames={layerNames}
          currentArchitectureStr={currentArchitectureStr}
          updatedArchitectureStr={updatedArchitectureStr}
          selectedMutation={selectedMutation}
          onSelectManualMutation={(mut) => setSelectedMutation(mut)}
          metrics={metrics}
          deltas={deltas}
          currentScore={currentScore}
          newScore={newScore}
          thresholdScore={thresholdScore}
          decision={decision}
          reason={reason}
          mutationDetails={mutationDetails}
          onRunEvolution={handleRunEvolution}
          onResetEvolution={handleResetEvolution}
          isEvolving={isEvolving}
          evolutionStep={evolutionStep}
          evolutionHistory={evolutionHistory}
          sessionKey={sessionKey}
          hasEnvKey={!!ENV_API_KEY}
          hasServerKey={hasServerKey}
          onGenerateKey={handleGenerateKey}
          onResetToEnvKey={handleResetToEnvKey}
          onClearKey={handleClearKey}
          onReturnToWelcome={() => setView('welcome')}
        />
      )}
    </div>
  );
}
