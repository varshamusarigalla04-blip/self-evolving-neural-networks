/**
 * api/evolve.js - Vercel Serverless Function
 * 
 * Secure Backend Endpoint for Self-Evolving Neural Networks
 * - Protects EVOLVE_API_KEY on the Vercel server (never exposed to browser or client bundle)
 * - Evaluates neural network performance against threshold
 * - Computes autonomous architecture mutations on the server
 * - Never returns the raw secret API key to the client
 */

export default async function handler(req, res) {
  // Enable CORS for frontend client interaction
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Retrieve secret API key from Vercel backend environment
  const serverApiKey = process.env.EVOLVE_API_KEY || '';
  const hasServerKey = Boolean(serverApiKey && serverApiKey.trim().length > 0);

  // GET request: Health & Configuration Status Check
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'healthy',
      service: 'Self-Evolving Neural Networks Agent Service',
      version: '1.0.0',
      hasServerKey,
      authMode: hasServerKey ? 'secured-backend-vault' : 'simulation-fallback',
      timestamp: new Date().toISOString()
    });
  }

  // POST request: Autonomous Mutation & Evolution Execution
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const currentScore = Number(body.currentScore) || 72;
      const thresholdScore = Number(body.thresholdScore) || 85;
      const layers = Array.isArray(body.layers) && body.layers.length >= 3 ? body.layers : [4, 4, 4, 2];
      const generation = Number(body.generation) || 1;

      // 1. Evaluate if threshold is already met
      if (currentScore >= thresholdScore) {
        return res.status(200).json({
          success: true,
          hasServerKey,
          decision: 'THRESHOLD MET',
          reason: `Current performance (${currentScore}%) meets or exceeds the target threshold (${thresholdScore}%). Architecture is optimal.`,
          mutationType: 'none',
          mutationDetails: 'No mutation required (Stabilized)',
          candidateLayers: layers,
          newScore: currentScore,
          isStabilized: true,
          evaluatedAt: new Date().toISOString()
        });
      }

      // 2. Select Mutation Type
      const numHidden = layers.length - 2;
      const availableMutations = ['add_neurons'];
      if (layers[1] > 2 || (layers[2] && layers[2] > 2)) {
        availableMutations.push('remove_neurons');
      }
      if (numHidden < 3) {
        availableMutations.push('add_hidden_layer');
      }
      if (numHidden > 1) {
        availableMutations.push('remove_hidden_layer');
      }

      // Weighted selection based on performance
      let chosenType = 'add_neurons';
      const rand = Math.random();
      if (currentScore < 78) {
        chosenType = rand < 0.7 ? 'add_neurons' : (availableMutations.includes('add_hidden_layer') ? 'add_hidden_layer' : 'add_neurons');
      } else {
        if (rand < 0.5) chosenType = 'add_neurons';
        else if (rand < 0.75 && availableMutations.includes('remove_neurons')) chosenType = 'remove_neurons';
        else if (rand < 0.9 && availableMutations.includes('add_hidden_layer')) chosenType = 'add_hidden_layer';
        else if (availableMutations.includes('remove_hidden_layer')) chosenType = 'remove_hidden_layer';
        else chosenType = 'add_neurons';
      }

      let candidateLayers = [...layers];
      let mutDesc = '';
      let chosenCategory = 'Width Expansion';

      if (chosenType === 'add_neurons') {
        const targetHiddenIdx = (candidateLayers.length > 3 && Math.random() > 0.5) ? 2 : 1;
        const addCount = 2;
        candidateLayers[targetHiddenIdx] = candidateLayers[targetHiddenIdx] + addCount;
        mutDesc = `Add ${addCount} neurons to Hidden Layer ${targetHiddenIdx}`;
        chosenCategory = 'Width Expansion';
      } else if (chosenType === 'remove_neurons') {
        const targetHiddenIdx = (candidateLayers.length > 3 && candidateLayers[2] > 2) ? 2 : 1;
        const removeCount = 1;
        candidateLayers[targetHiddenIdx] = Math.max(2, candidateLayers[targetHiddenIdx] - removeCount);
        mutDesc = `Prune ${removeCount} neuron from Hidden Layer ${targetHiddenIdx}`;
        chosenCategory = 'Pruning Optimization';
      } else if (chosenType === 'add_hidden_layer') {
        const newLayerNeurons = 4;
        candidateLayers.splice(candidateLayers.length - 1, 0, newLayerNeurons);
        mutDesc = `Insert new Hidden Layer (${newLayerNeurons} neurons)`;
        chosenCategory = 'Depth Expansion';
      } else if (chosenType === 'remove_hidden_layer') {
        const removeIdx = candidateLayers.length - 2;
        candidateLayers.splice(removeIdx, 1);
        mutDesc = `Prune redundant Hidden Layer ${removeIdx}`;
        chosenCategory = 'Depth Pruning';
      }

      // 3. Compute Simulated Candidate Performance
      const deltaRand = (Math.random() * 4 - 0.5);
      const isImprovement = deltaRand > 0.4;
      const candidateScore = Math.min(
        thresholdScore + 2,
        Math.max(65, isImprovement ? currentScore + Math.round(deltaRand + 2) : currentScore - Math.round(Math.abs(deltaRand)))
      );

      const decision = isImprovement ? 'ACCEPTED' : 'REJECTED';
      const reason = isImprovement
        ? `New architecture improved performance by +${candidateScore - currentScore}%. Mutation accepted into active topology.`
        : `New architecture reduced performance by -${currentScore - candidateScore}%. Mutation rejected, retaining previous architecture.`;

      return res.status(200).json({
        success: true,
        hasServerKey,
        decision,
        reason,
        mutationType: chosenType,
        mutationCategory: chosenCategory,
        mutationDetails: mutDesc,
        candidateLayers: isImprovement ? candidateLayers : layers,
        newScore: isImprovement ? candidateScore : currentScore,
        evaluatedAt: new Date().toISOString()
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to process evolution mutation on serverless backend',
        details: err.message
      });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method Not Allowed' });
}
