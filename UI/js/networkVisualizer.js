/**
 * networkVisualizer.js - Interactive Dynamic Neural Network Architecture Visualizer
 * Renders Input, Hidden, and Output layers with real-time neuron counts,
 * synapse connections, animated data signal pulses, and mutation diff highlights.
 * 
 * Includes 10-second automatic animation timer, settle-to-stable-state,
 * status indicator ("Animation: Running" / "Animation: Paused"), and Replay functionality.
 */

class NetworkVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas with id ${canvasId} not found.`);
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.synapses = [];
    this.pulses = []; // animated signals traveling across synapses
    this.hoveredNode = null;
    this.animationFrameId = null;

    // 10-Second Animation Control Properties
    this.animationDuration = 10000; // exactly 10 seconds
    this.animationStartTime = null;
    this.isAnimating = false;
    this.animationTimeoutId = null;

    this.colors = {
      input: { fill: 'rgba(14, 165, 233, 0.25)', stroke: '#0ea5e9', glow: '#38bdf8', text: '#bae6fd' },
      hidden: { fill: 'rgba(139, 92, 246, 0.25)', stroke: '#8b5cf6', glow: '#a78bfa', text: '#ddd6fe' },
      output: { fill: 'rgba(16, 185, 129, 0.25)', stroke: '#10b981', glow: '#34d399', text: '#a7f3d0' },
      synapse: 'rgba(148, 163, 184, 0.15)',
      synapseActive: 'rgba(56, 189, 248, 0.65)',
      addedNode: { fill: 'rgba(34, 197, 94, 0.4)', stroke: '#22c55e', glow: '#4ade80', text: '#bbf7d0' },
      removedNode: { fill: 'rgba(244, 63, 94, 0.35)', stroke: '#f43f5e', glow: '#fb7185', text: '#fecdd3' }
    };

    this.init();
  }

  init() {
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    // Mouse hover listener (supports tooltips even when animation is paused)
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left);
      const y = (e.clientY - rect.top);

      let found = null;
      for (const node of this.nodes) {
        const radius = node.currentRadius || node.radius;
        const dist = Math.hypot(node.x - x, node.y - y);
        if (dist <= radius + 6) {
          found = node;
          break;
        }
      }

      if (this.hoveredNode !== found) {
        this.hoveredNode = found;
        this.canvas.style.cursor = found ? 'pointer' : 'default';
        // If animation is paused, re-render frame to show/hide tooltip
        if (!this.isAnimating) {
          this.render();
        }
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      if (this.hoveredNode) {
        this.hoveredNode = null;
        if (!this.isAnimating) {
          this.render();
        }
      }
    });

    // Bind Replay Button if present in DOM
    const btnReplay = document.getElementById('btnReplayAnimation');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        this.replayAnimation();
      });
    }

    // Start initial 10-second animation
    this.animate = this.animate.bind(this);
    this.startAnimation(10000);
  }

  handleResize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const width = parent ? parent.clientWidth : 800;

    // Adapt height so all layers, neurons, and labels have plenty of vertical room without overlap
    const arch = AppState.candidateArch || AppState.currentArch;
    const layerSizes = arch ? [arch.input, ...(arch.hidden || []), arch.output] : [4, 4, 4, 2];
    const maxNeurons = Math.max(...layerSizes, 4);
    const minHeight = Math.max(430, Math.min(580, maxNeurons * 36 + 96));
    const height = Math.max(minHeight, Math.min(580, Math.round(window.innerHeight * 0.44)));

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.width = width;
    this.height = height;

    this.rebuildGraph();
  }

  /**
   * Rebuilds node coordinates and connections based on the current (or candidate) architecture
   */
  rebuildGraph() {
    if (!this.width || !this.height) return;

    // Display candidate architecture if present, otherwise current baseline
    const arch = AppState.candidateArch || AppState.currentArch;
    const isCandidate = Boolean(AppState.candidateArch);

    const layerSizes = [arch.input, ...arch.hidden, arch.output];
    const layerNames = [
      'Input Layer',
      ...arch.hidden.map((_, i) => arch.hidden.length === 1 ? 'Hidden Layer' : `Hidden Layer ${i + 1}`),
      'Output Layer'
    ];
    const layerTypes = [
      'input',
      ...arch.hidden.map(() => 'hidden'),
      'output'
    ];

    const numLayers = layerSizes.length;
    const horizontalMargin = Math.max(65, this.width * 0.1);
    const verticalMarginTop = 62;    // Space for layer headers at top
    const verticalMarginBottom = 46; // Space for neuron count at bottom
    const availableWidth = this.width - horizontalMargin * 2;
    const layerSpacing = availableWidth / (numLayers - 1);
    const availableHeight = this.height - verticalMarginTop - verticalMarginBottom;

    this.nodes = [];
    this.synapses = [];

    // Construct nodes for each layer
    for (let l = 0; l < numLayers; l++) {
      const neuronCount = layerSizes[l];
      const x = horizontalMargin + l * layerSpacing;
      const type = layerTypes[l];
      const layerName = layerNames[l];

      const spacingY = availableHeight / (neuronCount + 1);

      // Node radius dynamically adjusts so circles and labels never collide with adjacent neurons
      const maxAllowedRadius = Math.max(7, Math.floor((spacingY - 26) / 2));
      const radius = Math.max(8, Math.min(15, maxAllowedRadius));

      for (let n = 0; n < neuronCount; n++) {
        const y = verticalMarginTop + (n + 1) * spacingY;
        
        // Consistent neuron label naming: Input 1, Hidden 1, Output 1
        let label = '';
        if (type === 'input') {
          label = `Input ${n + 1}`;
        } else if (type === 'output') {
          label = `Output ${n + 1}`;
        } else {
          label = `Hidden ${n + 1}`;
        }

        // Check if this node is newly added in candidate
        let isAdded = false;
        if (isCandidate && type === 'hidden') {
          const hiddenIdx = l - 1;
          const baselineCount = AppState.currentArch.hidden[hiddenIdx] || 0;
          if (n >= baselineCount) isAdded = true;
        }

        // Random subtle oscillation phase per node
        const phaseX = (l * 0.7) + (n * 1.3) + Math.random() * 0.5;
        const phaseY = (l * 1.1) + (n * 0.8) + Math.random() * 0.5;
        const phaseR = (n * 1.5) + Math.random() * 0.5;

        this.nodes.push({
          id: `${l}_${n}`,
          layerIndex: l,
          neuronIndex: n,
          totalInLayer: neuronCount,
          layerName,
          type,
          label,
          baseX: x,
          baseY: y,
          x,
          y,
          radius,
          currentRadius: radius,
          phaseX,
          phaseY,
          phaseR,
          isAdded
        });
      }
    }

    // Construct synapses between layer l and l + 1
    for (let l = 0; l < numLayers - 1; l++) {
      const sourceNodes = this.nodes.filter(n => n.layerIndex === l);
      const targetNodes = this.nodes.filter(n => n.layerIndex === l + 1);

      for (const src of sourceNodes) {
        for (const tgt of targetNodes) {
          const isHighlight = src.isAdded || tgt.isAdded;
          this.synapses.push({
            src,
            tgt,
            isHighlight,
            weightOpacity: 0.12 + Math.random() * 0.16
          });
        }
      }
    }

    // Spawn pulses if animating
    if (this.isAnimating) {
      this.pulses = [];
      const pulseCount = Math.min(18, this.synapses.length);
      for (let i = 0; i < pulseCount; i++) {
        this.spawnPulse();
      }
    } else {
      this.render();
    }
  }

  spawnPulse() {
    if (this.synapses.length === 0) return;
    const synapse = this.synapses[Math.floor(Math.random() * this.synapses.length)];
    this.pulses.push({
      synapse,
      progress: Math.random(),
      speed: 0.008 + Math.random() * 0.014
    });
  }

  /**
   * Starts the subtle animation for exactly duration (default 10,000ms = 10s)
   */
  startAnimation(duration = 10000) {
    if (this.animationTimeoutId) {
      clearTimeout(this.animationTimeoutId);
      this.animationTimeoutId = null;
    }

    this.isAnimating = true;
    this.animationDuration = duration;
    this.animationStartTime = performance.now();

    // Populate pulses
    this.pulses = [];
    const pulseCount = Math.min(18, this.synapses.length);
    for (let i = 0; i < pulseCount; i++) {
      this.spawnPulse();
    }

    // Update Status Indicator to "Animation: Running"
    this.updateStatusUI('Running');

    // Auto stop after exactly 10 seconds
    this.animationTimeoutId = setTimeout(() => {
      this.stopAnimation();
    }, duration);

    // Run animation frame
    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  }

  /**
   * Automatically stops all movement and settles the neural network in a stable state
   */
  stopAnimation() {
    this.isAnimating = false;

    if (this.animationTimeoutId) {
      clearTimeout(this.animationTimeoutId);
      this.animationTimeoutId = null;
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Settle all neurons firmly to exact baseline coordinates
    for (const node of this.nodes) {
      node.x = node.baseX;
      node.y = node.baseY;
      node.currentRadius = node.radius;
    }

    // Clear moving energy pulses for a stable display
    this.pulses = [];

    // Update Status Indicator to "Animation: Paused"
    this.updateStatusUI('Paused');

    // Render final stable architecture
    this.render();
  }

  /**
   * Replays the 10-second animation
   */
  replayAnimation() {
    this.startAnimation(10000);
  }

  /**
   * Updates DOM status indicator ("Animation: Running" vs "Animation: Paused")
   */
  updateStatusUI(state) {
    const elBadge = document.getElementById('animStatusIndicator');
    const elText = document.getElementById('animStatusText');

    if (elText) {
      elText.textContent = `Animation: ${state}`;
    }

    if (elBadge) {
      if (state === 'Running') {
        elBadge.className = 'anim-status-badge running';
      } else {
        elBadge.className = 'anim-status-badge paused';
      }
    }
  }

  /**
   * Main render / animation loop
   */
  animate() {
    if (!this.isAnimating) {
      return; // Stop animation loop
    }

    const now = performance.now();
    const elapsed = now - this.animationStartTime;

    // Strict 10-second check
    if (elapsed >= this.animationDuration) {
      this.stopAnimation();
      return;
    }

    // Apply subtle harmonic movement to neurons during the 10s active period
    const t = elapsed / 1000.0;
    for (const node of this.nodes) {
      // Subtle float: max 1.2px horizontal, max 1.6px vertical
      const dx = Math.sin(t * 1.5 + node.phaseX) * 1.2;
      const dy = Math.cos(t * 1.3 + node.phaseY) * 1.6;
      node.x = node.baseX + dx;
      node.y = node.baseY + dy;

      // Subtle breathing pulse on radius
      node.currentRadius = node.radius + Math.sin(t * 2.2 + node.phaseR) * 0.8;
    }

    this.render();

    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  render() {
    const ctx = this.ctx;
    if (!ctx || !this.width || !this.height) return;

    ctx.clearRect(0, 0, this.width, this.height);

    // Draw background grid lines (subtle dark sci-fi look)
    this.drawBackgroundGrid(ctx);

    // Draw layer labels & banners
    this.drawLayerHeaders(ctx);

    // Draw Synapses
    this.drawSynapses(ctx);

    // Draw Pulses (only when actively animating)
    if (this.isAnimating) {
      this.drawPulses(ctx);
    }

    // Draw Neurons
    this.drawNodes(ctx);

    // Draw Tooltip if hovering
    if (this.hoveredNode) {
      this.drawTooltip(ctx, this.hoveredNode);
    }
  }

  drawBackgroundGrid(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < this.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawLayerHeaders(ctx) {
    const arch = AppState.candidateArch || AppState.currentArch;
    const isCandidate = Boolean(AppState.candidateArch);
    const layerSizes = [arch.input, ...arch.hidden, arch.output];
    const numLayers = layerSizes.length;
    const horizontalMargin = Math.max(60, this.width * 0.1);
    const availableWidth = this.width - horizontalMargin * 2;
    const layerSpacing = availableWidth / (numLayers - 1);

    ctx.save();
    for (let l = 0; l < numLayers; l++) {
      const x = horizontalMargin + l * layerSpacing;
      let title = '';
      let badge = '';
      let color = '#94a3b8';

      if (l === 0) {
        title = 'INPUT LAYER';
        color = this.colors.input.stroke;
      } else if (l === numLayers - 1) {
        title = 'OUTPUT LAYER';
        color = this.colors.output.stroke;
      } else {
        title = numLayers === 3 ? 'HIDDEN LAYER' : `HIDDEN LAYER ${l}`;
        color = this.colors.hidden.stroke;
      }

      const count = layerSizes[l];

      // Check if this layer was modified in candidate
      if (isCandidate && l > 0 && l < numLayers - 1) {
        const hiddenIdx = l - 1;
        const baselineSize = AppState.currentArch.hidden[hiddenIdx];
        if (baselineSize === undefined) {
          badge = '+NEW LAYER';
          color = '#22c55e';
        } else if (count > baselineSize) {
          badge = `+${count - baselineSize} NEURON`;
          color = '#22c55e';
        } else if (count < baselineSize) {
          badge = `-${baselineSize - count} PRUNED`;
          color = '#f43f5e';
        }
      }

      // Top Title (INPUT LAYER, HIDDEN LAYER, OUTPUT LAYER)
      ctx.font = '700 12px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, x, 28);

      if (badge) {
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = color;
        ctx.fillText(badge, x, 42);
      }

      // Bottom Neuron Count Badge (Display the number of neurons under each layer)
      ctx.font = '600 11px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${count} Neurons`, x, this.height - 18);
    }
    ctx.restore();
  }

  drawSynapses(ctx) {
    ctx.save();
    for (const syn of this.synapses) {
      ctx.beginPath();
      ctx.moveTo(syn.src.x, syn.src.y);
      ctx.lineTo(syn.tgt.x, syn.tgt.y);

      if (syn.isHighlight) {
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.45)';
        ctx.lineWidth = 2.0;
      } else {
        ctx.strokeStyle = `rgba(148, 163, 184, ${syn.weightOpacity})`;
        ctx.lineWidth = 1.0;
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  drawPulses(ctx) {
    ctx.save();
    for (let i = 0; i < this.pulses.length; i++) {
      const pulse = this.pulses[i];
      pulse.progress += pulse.speed;

      if (pulse.progress >= 1.0) {
        if (this.synapses.length > 0) {
          pulse.synapse = this.synapses[Math.floor(Math.random() * this.synapses.length)];
          pulse.progress = 0;
          pulse.speed = 0.008 + Math.random() * 0.014;
        }
        continue;
      }

      const { src, tgt } = pulse.synapse;
      const px = src.x + (tgt.x - src.x) * pulse.progress;
      const py = src.y + (tgt.y - src.y) * pulse.progress;

      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = pulse.synapse.isHighlight ? '#4ade80' : '#38bdf8';
      ctx.shadowColor = pulse.synapse.isHighlight ? '#22c55e' : '#0ea5e9';
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    ctx.restore();
  }

  drawNodes(ctx) {
    // Pass 1: Render all neuron circles
    for (const node of this.nodes) {
      let scheme = this.colors[node.type];
      if (node.isAdded) scheme = this.colors.addedNode;

      const isHovered = this.hoveredNode === node;
      const r = isHovered ? (node.currentRadius || node.radius) + 2.5 : (node.currentRadius || node.radius);

      ctx.save();
      // Outer Glow
      ctx.shadowColor = scheme.glow;
      ctx.shadowBlur = isHovered ? 14 : 7;

      // Circle Fill
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = scheme.fill;
      ctx.fill();

      // Border Stroke
      ctx.strokeStyle = scheme.stroke;
      ctx.lineWidth = isHovered ? 2.2 : 1.6;
      ctx.stroke();

      // Inner Core Dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, Math.max(2, r * 0.32), 0, Math.PI * 2);
      ctx.fillStyle = scheme.stroke;
      ctx.fill();

      ctx.restore();
    }

    // Pass 2: Render small labels directly below every neuron across all layers
    for (const node of this.nodes) {
      this.drawNeuronLabel(ctx, node);
    }
  }

  /**
   * Unified Neuron Label Component
   * Applies the exact same positioning logic for Input, Hidden, and Output neurons:
   * - Placed directly below the neuron
   * - Center-aligned horizontally with the neuron (node.x)
   * - 6–8 px vertical spacing between the bottom of the neuron and the label
   * - Font size: 10–11px, weight: 500
   * - Subtle, readable text color with contrast against dashboard background
   * - No large badges, boxes, or icons
   * - Moves dynamically with the neuron during animation, screen resizing, mutations, and layer additions
   */
  drawNeuronLabel(ctx, node) {
    const isHovered = this.hoveredNode === node;
    const r = isHovered ? (node.currentRadius || node.radius) + 2.5 : (node.currentRadius || node.radius);

    // Exact 6–8 px vertical spacing between bottom of neuron circle and label
    const verticalSpacing = node.totalInLayer > 8 ? 6 : 7;
    const labelX = node.x;
    const labelY = node.y + r + verticalSpacing;

    ctx.save();

    // Typography: 10–11px, font-weight: 500
    const fontSize = node.totalInLayer > 7 ? 10 : 11;
    ctx.font = `500 ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Subtle dark glow to guarantee crisp legibility against dark canvas and any synapse lines
    ctx.shadowColor = 'rgba(8, 13, 24, 0.95)';
    ctx.shadowBlur = 4;

    // Subtle readable text color contrasting with dashboard background (#080d18)
    if (node.isAdded) {
      ctx.fillStyle = '#86efac'; // soft readable green for mutated nodes
    } else if (isHovered) {
      ctx.fillStyle = '#f8fafc'; // crisp bright highlight on hover
    } else {
      ctx.fillStyle = '#94a3b8'; // subtle, readable slate color
    }

    ctx.fillText(node.label, labelX, labelY);
    ctx.restore();
  }

  drawTooltip(ctx, node) {
    ctx.save();
    const padding = 10;
    const text1 = `${node.layerName}: ${node.label}`;
    const text2 = node.isAdded ? 'Status: [Mutated Neuron]' : `Layer Size: ${node.totalInLayer} neurons`;

    ctx.font = 'bold 12px sans-serif';
    const w1 = ctx.measureText(text1).width;
    ctx.font = '11px monospace';
    const w2 = ctx.measureText(text2).width;
    const boxWidth = Math.max(w1, w2) + padding * 2;
    const boxHeight = 48;

    let bx = node.x + 15;
    let by = node.y - boxHeight - 10;
    if (bx + boxWidth > this.width) bx = node.x - boxWidth - 15;
    if (by < 10) by = node.y + 20;

    // Tooltip card
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = node.isAdded ? '#22c55e' : '#38bdf8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(bx, by, boxWidth, boxHeight, 6);
    ctx.fill();
    ctx.stroke();

    // Texts
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(text1, bx + padding, by + 18);

    ctx.fillStyle = node.isAdded ? '#86efac' : '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(text2, bx + padding, by + 36);

    ctx.restore();
  }
}

window.NetworkVisualizer = NetworkVisualizer;
