/**
 * src/services/visualizerEngine.js
 * Interactive Dynamic Neural Network Architecture Visualizer
 */

import { AppState } from './state.js';

export class NetworkVisualizer {
  constructor(canvasOrId) {
    if (typeof canvasOrId === 'string') {
      this.canvas = document.getElementById(canvasOrId);
    } else {
      this.canvas = canvasOrId;
    }

    if (!this.canvas) {
      console.error(`Canvas ${canvasOrId} not found.`);
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.synapses = [];
    this.pulses = [];
    this.hoveredNode = null;
    this.animationFrameId = null;

    this.animationDuration = 10000;
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

    this.handleMouseMove = (e) => {
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
        if (!this.isAnimating) {
          this.render();
        }
      }
    };

    this.handleMouseLeave = () => {
      if (this.hoveredNode) {
        this.hoveredNode = null;
        if (!this.isAnimating) {
          this.render();
        }
      }
    };

    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);

    this.animate = this.animate.bind(this);
    this.startAnimation(10000);
  }

  destroy() {
    this.stopAnimation();
    window.removeEventListener('resize', this.handleResize);
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    }
  }

  handleResize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const width = parent ? parent.clientWidth : 800;

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

  rebuildGraph() {
    if (!this.width || !this.height) return;

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
    const verticalMarginTop = 62;
    const verticalMarginBottom = 46;
    const availableWidth = this.width - horizontalMargin * 2;
    const layerSpacing = availableWidth / (numLayers - 1);
    const availableHeight = this.height - verticalMarginTop - verticalMarginBottom;

    this.nodes = [];
    this.synapses = [];

    for (let l = 0; l < numLayers; l++) {
      const neuronCount = layerSizes[l];
      const x = horizontalMargin + l * layerSpacing;
      const type = layerTypes[l];
      const layerName = layerNames[l];

      const spacingY = availableHeight / (neuronCount + 1);
      const maxAllowedRadius = Math.max(7, Math.floor((spacingY - 26) / 2));
      const radius = Math.max(8, Math.min(15, maxAllowedRadius));

      for (let n = 0; n < neuronCount; n++) {
        const y = verticalMarginTop + (n + 1) * spacingY;
        
        let label = '';
        if (type === 'input') {
          label = `Input ${n + 1}`;
        } else if (type === 'output') {
          label = `Output ${n + 1}`;
        } else {
          label = `Hidden ${n + 1}`;
        }

        let isAdded = false;
        if (isCandidate && type === 'hidden') {
          const hiddenIdx = l - 1;
          const baselineCount = AppState.currentArch.hidden[hiddenIdx] || 0;
          if (n >= baselineCount) isAdded = true;
        }

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

  startAnimation(duration = 10000) {
    if (this.animationTimeoutId) {
      clearTimeout(this.animationTimeoutId);
      this.animationTimeoutId = null;
    }

    this.isAnimating = true;
    this.animationDuration = duration;
    this.animationStartTime = performance.now();

    this.pulses = [];
    const pulseCount = Math.min(18, this.synapses.length);
    for (let i = 0; i < pulseCount; i++) {
      this.spawnPulse();
    }

    this.updateStatusUI('Running');

    this.animationTimeoutId = setTimeout(() => {
      this.stopAnimation();
    }, duration);

    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  }

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

    for (const node of this.nodes) {
      node.x = node.baseX;
      node.y = node.baseY;
      node.currentRadius = node.radius;
    }

    this.pulses = [];
    this.updateStatusUI('Paused');
    this.render();
  }

  replayAnimation() {
    this.startAnimation(10000);
  }

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

  animate() {
    if (!this.isAnimating) {
      return;
    }

    const now = performance.now();
    const elapsed = now - this.animationStartTime;

    if (elapsed >= this.animationDuration) {
      this.stopAnimation();
      return;
    }

    const t = elapsed / 1000.0;
    for (const node of this.nodes) {
      const dx = Math.sin(t * 1.5 + node.phaseX) * 1.2;
      const dy = Math.cos(t * 1.3 + node.phaseY) * 1.6;
      node.x = node.baseX + dx;
      node.y = node.baseY + dy;
      node.currentRadius = node.radius + Math.sin(t * 2.2 + node.phaseR) * 0.8;
    }

    this.render();
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  render() {
    const ctx = this.ctx;
    if (!ctx || !this.width || !this.height) return;

    ctx.clearRect(0, 0, this.width, this.height);
    this.drawBackgroundGrid(ctx);
    this.drawLayerHeaders(ctx);
    this.drawSynapses(ctx);

    if (this.isAnimating) {
      this.drawPulses(ctx);
    }

    this.drawNodes(ctx);

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
    for (const node of this.nodes) {
      let scheme = this.colors[node.type];
      if (node.isAdded) scheme = this.colors.addedNode;

      const isHovered = this.hoveredNode === node;
      const r = isHovered ? (node.currentRadius || node.radius) + 2.5 : (node.currentRadius || node.radius);

      ctx.save();
      ctx.shadowColor = scheme.glow;
      ctx.shadowBlur = isHovered ? 14 : 7;

      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = scheme.fill;
      ctx.fill();

      ctx.strokeStyle = scheme.stroke;
      ctx.lineWidth = isHovered ? 2.2 : 1.6;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(node.x, node.y, Math.max(2, r * 0.32), 0, Math.PI * 2);
      ctx.fillStyle = scheme.stroke;
      ctx.fill();

      ctx.restore();
    }

    for (const node of this.nodes) {
      this.drawNeuronLabel(ctx, node);
    }
  }

  drawNeuronLabel(ctx, node) {
    const isHovered = this.hoveredNode === node;
    const r = isHovered ? (node.currentRadius || node.radius) + 2.5 : (node.currentRadius || node.radius);

    const verticalSpacing = node.totalInLayer > 8 ? 6 : 7;
    const labelX = node.x;
    const labelY = node.y + r + verticalSpacing;

    ctx.save();
    const fontSize = node.totalInLayer > 7 ? 10 : 11;
    ctx.font = `500 ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    ctx.shadowColor = 'rgba(8, 13, 24, 0.95)';
    ctx.shadowBlur = 4;

    if (node.isAdded) {
      ctx.fillStyle = '#86efac';
    } else if (isHovered) {
      ctx.fillStyle = '#f8fafc';
    } else {
      ctx.fillStyle = '#94a3b8';
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

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = node.isAdded ? '#22c55e' : '#38bdf8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(bx, by, boxWidth, boxHeight, 6);
    ctx.fill();
    ctx.stroke();

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

if (typeof window !== 'undefined') {
  window.NetworkVisualizer = NetworkVisualizer;
}

export default NetworkVisualizer;
