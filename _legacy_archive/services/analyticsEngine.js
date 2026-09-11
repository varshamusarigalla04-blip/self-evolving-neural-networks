/**
 * modelComparisonChart.js
 * AI Model Performance & Variation Analysis
 *
 * Professional ML experiment analytics dashboard engine featuring:
 * 1. Summary statistics (Best Demo, Average, Highest Variation, Models Compared).
 * 2. Model selection checkboxes (dynamically filters curves across all graphs).
 * 3. Graph 1: Multi-line performance variation across evaluation iterations (smooth cubic splines & crosshairs).
 * 4. Graph 2: Metric-wise model variation with dynamic category dropdown.
 * 5. Graph 3: Performance variation across generations (Gen 1 to Gen 8).
 *
 * NOTE: Values are simulated demo metrics for prototype demonstration.
let MODEL_CANVAS_PATHS = {};
if (typeof Path2D !== 'undefined') {
  MODEL_CANVAS_PATHS = {
    gpt: new Path2D('M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.52 2.9A5.98 5.98 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.2 5.99 5.99 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.08zm-9.02 12.61a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.8.8 0 0 0 .39-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.49 4.5zm-9.66-4.13a4.47 4.47 0 0 1-.54-3.01l.14.08 4.79 2.76a.77.77 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06L9.74 19.95a4.5 4.5 0 0 1-6.14-1.65zM2.34 7.9a4.49 4.49 0 0 1 2.37-1.98v5.68a.77.77 0 0 0 .38.68l5.82 3.35-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.79A4.5 4.5 0 0 1 2.34 7.9zm16.1 3.85-5.84-3.37 2.02-1.17a.08.08 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.68 8.1v-5.67a.79.79 0 0 0-.4-.68zm2.01-3.02-.14-.08-4.78-2.79a.78.78 0 0 0-.78 0L8.81 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.14-2.02-1.17a.08.08 0 0 1-.04-.05V6.06a4.5 4.5 0 0 1 7.38-3.45l-.14.08-4.79 2.76a.8.8 0 0 0-.39.68zm1.1-2.37 2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5z'),
    gemini: new Path2D('M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z'),
    claude: new Path2D('M13.8 2.5h-3.6v6.8L5.3 4.4 2.8 6.9l4.9 4.9H1v3.6h6.7l-4.9 4.9 2.5 2.5 4.9-4.9v6.8h3.6v-6.8l4.9 4.9 2.5-2.5-4.9-4.9H23v-3.6h-6.7l4.9-4.9-2.5-2.5-4.9 4.9V2.5z'),
    llama: new Path2D('M12 6.5C8.8 6.5 6.2 8.7 5.1 11.7 4.2 9.5 2.4 8 0 8v3.5c1.8 0 3.3 1.3 3.9 3.1.6 1.8 2.2 3.4 4.5 3.4 3.2 0 5.8-2.2 6.9-5.2.9 2.2 2.7 3.7 5.1 3.7V14.5c-1.8 0-3.3-1.3-3.9-3.1-.6-1.8-2.2-3.4-4.5-3.4zm0 2.5c1.7 0 3 1.1 3.5 2.7-.8 2.1-2.6 3.8-5 3.8-1.7 0-3-1.1-3.5-2.7.8-2.1 2.6-3.8 5-3.8z'),
    deepseek: new Path2D('M21.5 12c0-4.5-3.5-8.5-8.5-8.5C7.5 3.5 3 7.5 3 12c0 2.2.9 4.2 2.3 5.7L4 21l4.2-1.1c1.4.7 3.1 1.1 4.8 1.1 5 0 8.5-4 8.5-9zm-9 6c-1.4 0-2.8-.4-4-.1l-1.8.5.5-1.7C6.4 15.6 6 14.1 6 12.5 6 8.9 8.7 6 12.5 6S19 8.9 19 12.5 16.3 18 12.5 18zm-.5-8c-.8 0-1.5.7-1.5 1.5S11.2 13 12 13s1.5-.7 1.5-1.5S12.8 10 12 10z'),
    mistral: new Path2D('M2 3h4v4H2zm16 0h4v4h-4zm-8 4h4v4h-4zM2 11h4v4H2zm8 0h4v4h-4zm8 0h4v4h-4zM2 19h8v2H2zm12 0h8v2h-8z'),
    nemotron: new Path2D('M8.94 4.5c-3.1 0-5.6 2.5-5.6 5.6 0 1.9.9 3.5 2.3 4.5-.3-.7-.5-1.5-.5-2.3 0-2.4 1.9-4.3 4.3-4.3 1.8 0 3.3 1.1 4 2.6-.5-.3-1.1-.5-1.7-.5-1.8 0-3.3 1.5-3.3 3.3 0 .8.3 1.6.8 2.2-.2 0-.4.1-.6.1-3 0-5.5-2.5-5.5-5.5 0-3.3 2.7-6 6-6 2.4 0 4.5 1.4 5.4 3.5-.8-.8-1.9-1.3-3.1-1.3-.1 0-.2 0-.2-.1v-1.3c2.7.2 4.9 2.1 5.4 4.8.9-1.7 1.4-3.6 1.4-5.6C19.84 4.5 14.94 0 8.94 0 4 0 0 4 0 8.94c0 4.2 2.9 7.7 6.8 8.7-.3-.6-.5-1.4-.5-2.2 0-2.2 1.8-4 4-4 1.1 0 2.1.4 2.8 1.2-.5-.3-1.1-.5-1.7-.5-1.4 0-2.6 1.2-2.6 2.6 0 .9.5 1.7 1.2 2.2-.1 0-.3.1-.4.1-1.9 0-3.5-1.6-3.5-3.5 0-2.2 1.8-4 4-4 1.8 0 3.3 1.2 3.8 2.8-.7-.6-1.6-1-2.6-1-.2 0-.3 0-.4-.1v-.8c2 .2 3.7 1.5 4.3 3.4.5-1.2.8-2.5.8-3.9 0-4.9-4-8.9-8.9-8.9z')
  };
}

const AI_ANALYTICS_MODELS = [
  {
    id: 'gpt',
    name: 'GPT',
    badge: 'OpenAI Frontier',
    color: '#10a37f',
    evaluations: [91.2, 92.5, 90.8, 93.4, 92.0, 94.1, 93.0, 94.5],
    metrics: {
      Reasoning: 92.4,
      Coding: 90.8,
      Language: 93.5,
      Mathematics: 89.2,
      Knowledge: 94.1,
      Speed: 84.0
    },
    generations: [88.0, 89.5, 91.0, 91.8, 92.6, 93.5, 94.0, 94.6]
  },
  {
    id: 'gemini',
    name: 'Gemini',
    badge: 'Google Frontier',
    color: '#1a73e8',
    evaluations: [89.5, 91.0, 92.2, 90.5, 93.1, 91.8, 92.6, 93.2],
    metrics: {
      Reasoning: 91.8,
      Coding: 89.5,
      Language: 92.8,
      Mathematics: 90.4,
      Knowledge: 93.2,
      Speed: 88.5
    },
    generations: [86.5, 88.2, 89.8, 91.0, 92.0, 92.5, 93.0, 93.4]
  },
  {
    id: 'claude',
    name: 'Claude',
    badge: 'Anthropic Frontier',
    color: '#d97706',
    evaluations: [92.0, 93.4, 91.8, 94.2, 93.5, 94.8, 94.0, 95.1],
    metrics: {
      Reasoning: 93.1,
      Coding: 91.2,
      Language: 94.6,
      Mathematics: 88.7,
      Knowledge: 92.5,
      Speed: 81.2
    },
    generations: [89.0, 90.5, 92.0, 93.0, 93.8, 94.4, 94.8, 95.2]
  },
  {
    id: 'llama',
    name: 'Llama',
    badge: 'Meta Open-Weight',
    color: '#8b5cf6',
    evaluations: [82.0, 84.2, 85.0, 83.8, 86.1, 85.5, 87.0, 86.8],
    metrics: {
      Reasoning: 84.5,
      Coding: 83.2,
      Language: 86.8,
      Mathematics: 80.1,
      Knowledge: 85.4,
      Speed: 91.0
    },
    generations: [78.5, 80.8, 82.5, 84.0, 85.2, 86.0, 86.6, 87.0]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    badge: 'Reasoning & Code',
    color: '#0ea5e9',
    evaluations: [87.5, 89.0, 91.5, 90.2, 92.4, 91.0, 93.0, 92.2],
    metrics: {
      Reasoning: 89.6,
      Coding: 92.4,
      Language: 87.5,
      Mathematics: 91.0,
      Knowledge: 88.2,
      Speed: 86.0
    },
    generations: [84.0, 86.2, 88.5, 89.8, 91.2, 92.0, 92.5, 92.8]
  },
  {
    id: 'mistral',
    name: 'Mistral',
    badge: 'High-Efficiency',
    color: '#f43f5e',
    evaluations: [81.0, 82.8, 84.5, 83.2, 85.0, 86.2, 85.8, 86.5],
    metrics: {
      Reasoning: 83.2,
      Coding: 81.5,
      Language: 85.0,
      Mathematics: 78.4,
      Knowledge: 83.8,
      Speed: 92.5
    },
    generations: [77.0, 79.5, 81.6, 83.2, 84.5, 85.4, 86.0, 86.6]
  },
  {
    id: 'nemotron',
    name: 'NVIDIA Nemotron',
    badge: 'Enterprise Reasoning',
    color: '#76b900',
    evaluations: [83.5, 85.2, 84.8, 86.5, 87.0, 86.2, 87.8, 88.2],
    metrics: {
      Reasoning: 85.8,
      Coding: 84.0,
      Language: 86.2,
      Mathematics: 82.5,
      Knowledge: 87.0,
      Speed: 89.4
    },
    generations: [80.0, 82.2, 84.0, 85.5, 86.6, 87.4, 88.0, 88.4]
  },
  {
    id: 'oxalfa',
    name: 'OX Alpha',
    badge: 'Academic Prototype',
    color: '#ec4899',
    evaluations: [75.0, 77.2, 76.5, 78.8, 77.4, 79.5, 78.6, 80.2],
    metrics: {
      Reasoning: 78.2,
      Coding: 76.4,
      Language: 79.5,
      Mathematics: 74.0,
      Knowledge: 77.8,
      Speed: 85.2
    },
    generations: [72.0, 74.0, 75.8, 77.2, 78.4, 79.2, 79.8, 80.4]
  }
];

const EVALUATION_POINTS = ['Eval 1', 'Eval 2', 'Eval 3', 'Eval 4', 'Eval 5', 'Eval 6', 'Eval 7', 'Eval 8'];
const GENERATION_POINTS = ['Gen 1', 'Gen 2', 'Gen 3', 'Gen 4', 'Gen 5', 'Gen 6', 'Gen 7', 'Gen 8'];
const METRICS_LIST = ['Reasoning', 'Coding', 'Language', 'Mathematics', 'Knowledge', 'Speed'];

class ModelVariationAnalytics {
  constructor() {
    // Active Models Set (default: all 8 enabled)
    this.activeModels = new Set(AI_ANALYTICS_MODELS.map(m => m.id));

    // Active Metric for Graph 2
    this.activeMetric = 'Reasoning';

    // Animation progress (0 to 1)
    this.animProgress = 1;
    this.animId = null;

    // Canvas & Tooltip DOM elements
    this.mainCanvas = document.getElementById('mainVariationCanvas');
    this.mainTooltip = document.getElementById('mainVariationTooltip');
    this.metricCanvas = document.getElementById('metricVariationCanvas');
    this.metricTooltip = document.getElementById('metricVariationTooltip');
    this.genCanvas = document.getElementById('generationVariationCanvas');
    this.genTooltip = document.getElementById('generationVariationTooltip');

    // Summary Card Elements
    this.elBestPerf = document.getElementById('summaryBestPerfVal');
    this.elBestPerfModel = document.getElementById('summaryBestPerfModel');
    this.elAvgPerf = document.getElementById('summaryAvgPerfVal');
    this.elHighestVar = document.getElementById('summaryHighestVarVal');
    this.elHighestVarModel = document.getElementById('summaryHighestVarModel');
    this.elModelsCount = document.getElementById('summaryModelsCountVal');

    // Mouse tracking states
    this.mainHoverEvalIdx = -1;
    this.genHoverGenIdx = -1;
    this.metricHoverModelId = null;

    this.init();
  }

  init() {
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);

    this.bindMouseEvents();
    this.handleResize();
    this.triggerAnimation();
    this.updateSummaryCards();
  }

  bindMouseEvents() {
    // Main Graph Hover
    if (this.mainCanvas) {
      this.mainCanvas.addEventListener('mousemove', (e) => this.handleMainMouseMove(e));
      this.mainCanvas.addEventListener('mouseleave', () => this.handleMainMouseLeave());
    }

    // Metric Graph Hover
    if (this.metricCanvas) {
      this.metricCanvas.addEventListener('mousemove', (e) => this.handleMetricMouseMove(e));
      this.metricCanvas.addEventListener('mouseleave', () => this.handleMetricMouseLeave());
    }

    // Generation Graph Hover
    if (this.genCanvas) {
      this.genCanvas.addEventListener('mousemove', (e) => this.handleGenMouseMove(e));
      this.genCanvas.addEventListener('mouseleave', () => this.handleGenMouseLeave());
    }
  }

  handleResize() {
    this.resizeCanvas(this.mainCanvas, 460);
    this.resizeCanvas(this.metricCanvas, 380);
    this.resizeCanvas(this.genCanvas, 380);
    this.renderAll();
  }

  resizeCanvas(canvas, targetHeight) {
    if (!canvas) return;
    const parent = canvas.parentElement;
    const width = parent ? parent.clientWidth : 800;
    const height = targetHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    canvas._w = width;
    canvas._h = height;
  }

  triggerAnimation() {
    if (this.animId) cancelAnimationFrame(this.animId);
    const startTime = performance.now();
    const duration = 550; // ms

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // easeOutCubic
      this.animProgress = 1 - Math.pow(1 - t, 3);
      this.renderAll();

      if (t < 1) {
        this.animId = requestAnimationFrame(animate);
      } else {
        this.animProgress = 1;
        this.renderAll();
      }
    };

    this.animId = requestAnimationFrame(animate);
  }

  // Model Visibility Toggles
  toggleModel(modelId, isChecked) {
    if (isChecked) {
      this.activeModels.add(modelId);
    } else {
      this.activeModels.delete(modelId);
    }
    this.triggerAnimation();
    this.updateSummaryCards();
  }

  setAllModels(enabled) {
    if (enabled) {
      AI_ANALYTICS_MODELS.forEach(m => this.activeModels.add(m.id));
    } else {
      this.activeModels.clear();
    }
    this.triggerAnimation();
    this.updateSummaryCards();
  }

  setMetric(metricName) {
    if (this.activeMetric === metricName) return;
    this.activeMetric = metricName;
    this.triggerAnimation();
  }

  getActiveModelsList() {
    return AI_ANALYTICS_MODELS.filter(m => this.activeModels.has(m.id));
  }

  /* ==========================================================================
     Summary Cards Calculation
     ========================================================================== */
  updateSummaryCards() {
    const active = this.getActiveModelsList();

    // 1. Models Compared Count
    if (this.elModelsCount) {
      this.elModelsCount.textContent = `${active.length} / ${AI_ANALYTICS_MODELS.length}`;
    }

    if (active.length === 0) {
      if (this.elBestPerf) this.elBestPerf.textContent = '—';
      if (this.elBestPerfModel) this.elBestPerfModel.textContent = 'No models active';
      if (this.elAvgPerf) this.elAvgPerf.textContent = '—';
      if (this.elHighestVar) this.elHighestVar.textContent = '—';
      if (this.elHighestVarModel) this.elHighestVarModel.textContent = 'No models active';
      return;
    }

    // 2. Best Demo Performance (across all evaluations of active models)
    let bestScore = -Infinity;
    let bestModel = active[0];

    // 3. Average Performance
    let totalScoreSum = 0;
    let totalScoreCount = 0;

    // 4. Highest Variation (std deviation across evaluations)
    let highestStdDev = -1;
    let highestVarModel = active[0];

    active.forEach(m => {
      const evals = m.evaluations;
      const modelSum = evals.reduce((a, b) => a + b, 0);
      const modelAvg = modelSum / evals.length;

      evals.forEach(val => {
        if (val > bestScore) {
          bestScore = val;
          bestModel = m;
        }
        totalScoreSum += val;
        totalScoreCount++;
      });

      // Compute variance & standard deviation
      const variance = evals.reduce((acc, val) => acc + Math.pow(val - modelAvg, 2), 0) / evals.length;
      const stdDev = Math.sqrt(variance);

      if (stdDev > highestStdDev) {
        highestStdDev = stdDev;
        highestVarModel = m;
      }
    });

    const cohortAvg = totalScoreCount > 0 ? (totalScoreSum / totalScoreCount) : 0;

    if (this.elBestPerf) this.elBestPerf.textContent = `${bestScore.toFixed(1)}%`;
    if (this.elBestPerfModel) this.elBestPerfModel.textContent = `${bestModel.name} (Peak Demo)`;

    if (this.elAvgPerf) this.elAvgPerf.textContent = `${cohortAvg.toFixed(1)}%`;

    if (this.elHighestVar) this.elHighestVar.textContent = `±${highestStdDev.toFixed(1)}%`;
    if (this.elHighestVarModel) this.elHighestVarModel.textContent = `${highestVarModel.name} (Max Spread)`;
  }

  /* ==========================================================================
     Master Render Method
     ========================================================================== */
  renderAll() {
    this.renderMainGraph();
    this.renderMetricGraph();
    this.renderGenGraph();
  }

  /* ==========================================================================
     GRAPH 1: Multi-Line Performance Variation Across Evaluations
     ========================================================================== */
  renderMainGraph() {
    const canvas = this.mainCanvas;
    if (!canvas || !canvas._w || !canvas._h) return;
    const ctx = canvas.getContext('2d');
    const w = canvas._w;
    const h = canvas._h;

    ctx.clearRect(0, 0, w, h);

    const pad = { top: 35, right: 35, bottom: 55, left: 180 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    const yMin = 65;
    const yMax = 100;

    // Draw Y-Axis Grid & Labels
    ctx.save();
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.fillStyle = '#64748b';
    ctx.lineWidth = 1;

    const ySteps = [70, 75, 80, 85, 90, 95, 100];
    ySteps.forEach(val => {
      const y = pad.top + chartH - ((val - yMin) / (yMax - yMin)) * chartH;
      ctx.beginPath();
      ctx.setLineDash([3, 4]);
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + chartW, y);
      ctx.stroke();

      ctx.fillText(`${val}%`, 30, y);
    });

    // Vertical Y-axis line at pad.left
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + chartH);
    ctx.stroke();
    ctx.restore();

    // Draw X-Axis Points
    const numPoints = EVALUATION_POINTS.length;
    const xStep = chartW / (numPoints - 1);

    ctx.save();
    ctx.font = '600 11px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillStyle = '#94a3b8';

    EVALUATION_POINTS.forEach((label, idx) => {
      const x = pad.left + idx * xStep;

      // Vertical guide line
      ctx.beginPath();
      ctx.setLineDash([2, 4]);
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + chartH);
      ctx.stroke();

      ctx.fillText(label, x, pad.top + chartH + 12);
    });

    // X-Axis Title
    ctx.font = '600 11px "Inter", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Evaluation Iterations →', pad.left + chartW / 2, pad.top + chartH + 34);
    ctx.restore();

    // Active Models
    const active = this.getActiveModelsList();
    if (active.length === 0) {
      this.drawEmptyNotice(ctx, w, h, 'No models selected. Check at least one model above.');
      return;
    }

    // Render Curves for each active model
    active.forEach(model => {
      const pts = model.evaluations.map((val, idx) => {
        const x = pad.left + idx * xStep;
        const targetY = pad.top + chartH - ((val - yMin) / (yMax - yMin)) * chartH;
        // Animated entrance
        const baseY = pad.top + chartH;
        const y = baseY - (baseY - targetY) * this.animProgress;
        return { x, y, val };
      });

      // 1. Shaded Gradient Fill Under Curve
      ctx.save();
      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
      grad.addColorStop(0, this.hexToRgba(model.color, 0.14));
      grad.addColorStop(1, this.hexToRgba(model.color, 0.0));

      ctx.beginPath();
      this.drawSmoothCurve(ctx, pts);
      ctx.lineTo(pad.left + chartW, pad.top + chartH);
      ctx.lineTo(pad.left, pad.top + chartH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      // 2. Smooth Line Stroke
      ctx.save();
      ctx.beginPath();
      this.drawSmoothCurve(ctx, pts);
      ctx.strokeStyle = model.color;
      ctx.lineWidth = 2.4;
      ctx.shadowColor = model.color;
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.restore();

      // 3. Line Dots
      pts.forEach((pt, pIdx) => {
        ctx.save();
        ctx.beginPath();
        const isHoveredCol = this.mainHoverEvalIdx === pIdx;
        const r = isHoveredCol ? 5 : 3.2;
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isHoveredCol ? '#ffffff' : model.color;
        ctx.shadowColor = model.color;
        ctx.shadowBlur = isHoveredCol ? 12 : 4;
        ctx.fill();

        if (isHoveredCol) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = model.color;
          ctx.stroke();
        }
        ctx.restore();
      });
    });

    // 4. Vertical Scanline Crosshair on Hover
    if (this.mainHoverEvalIdx >= 0 && this.mainHoverEvalIdx < numPoints) {
      const hX = pad.left + this.mainHoverEvalIdx * xStep;

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.moveTo(hX, pad.top);
      ctx.lineTo(hX, pad.top + chartH);
      ctx.stroke();

      // Small evaluation badge on top
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(EVALUATION_POINTS[this.mainHoverEvalIdx], hX, pad.top - 12);
      ctx.restore();
    }

    // Direct Model Name Labels on the Left Side of Each Curve (Origin / Eval 1)
    this.drawCurveStartLabels(ctx, active, pad, chartW, chartH, yMin, yMax, m => m.evaluations[0]);
  }

  handleMainMouseMove(e) {
    const canvas = this.mainCanvas;
    if (!canvas || !canvas._w) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const pad = { top: 35, right: 35, bottom: 55, left: 180 };
    const chartW = canvas._w - pad.left - pad.right;
    const numPoints = EVALUATION_POINTS.length;
    const xStep = chartW / (numPoints - 1);

    // Find closest evaluation point
    let closestIdx = -1;
    let minDiff = Infinity;
    for (let i = 0; i < numPoints; i++) {
      const ptX = pad.left + i * xStep;
      const diff = Math.abs(ptX - mouseX);
      if (diff < minDiff && diff < xStep * 0.75) {
        minDiff = diff;
        closestIdx = i;
      }
    }

    if (closestIdx !== this.mainHoverEvalIdx) {
      this.mainHoverEvalIdx = closestIdx;
      this.renderMainGraph();
      if (closestIdx >= 0) {
        this.showMainTooltip(closestIdx, e.clientX, e.clientY);
      } else {
        this.hideMainTooltip();
      }
    } else if (closestIdx >= 0) {
      this.showMainTooltip(closestIdx, e.clientX, e.clientY);
    }
  }

  handleMainMouseLeave() {
    this.mainHoverEvalIdx = -1;
    this.renderMainGraph();
    this.hideMainTooltip();
  }

  showMainTooltip(evalIdx, clientX, clientY) {
    const tt = this.mainTooltip;
    if (!tt) return;

    const active = this.getActiveModelsList();
    if (active.length === 0) return;

    // Rank models at this evaluation point
    const ranked = active
      .map(m => ({
        name: m.name,
        color: m.color,
        badge: m.badge,
        val: m.evaluations[evalIdx]
      }))
      .sort((a, b) => b.val - a.val);

    const rowsHtml = ranked
      .map(
        r => `
        <div class="tt-model-row">
          <span class="tt-color-dot" style="background: ${r.color};"></span>
          <span class="tt-model-name">${r.name}</span>
          <span class="tt-model-score">${r.val.toFixed(1)}%</span>
        </div>`
      )
      .join('');

    tt.innerHTML = `
      <div class="tt-header">
        <strong>${EVALUATION_POINTS[evalIdx]}</strong>
        <span class="tt-sub">Simulated Variation</span>
      </div>
      <div class="tt-body">
        ${rowsHtml}
      </div>
    `;

    tt.style.display = 'block';

    // Position tooltip relative to container
    const containerRect = this.mainCanvas.parentElement.getBoundingClientRect();
    let left = clientX - containerRect.left + 16;
    let top = clientY - containerRect.top - 20;

    if (left + 230 > this.mainCanvas._w) {
      left = clientX - containerRect.left - 240;
    }
    if (top < 10) top = 10;

    tt.style.left = `${left}px`;
    tt.style.top = `${top}px`;
  }

  hideMainTooltip() {
    if (this.mainTooltip) this.mainTooltip.style.display = 'none';
  }

  /* ==========================================================================
     GRAPH 2: Metric-wise Model Variation
     ========================================================================== */
  renderMetricGraph() {
    const canvas = this.metricCanvas;
    if (!canvas || !canvas._w || !canvas._h) return;
    const ctx = canvas.getContext('2d');
    const w = canvas._w;
    const h = canvas._h;

    ctx.clearRect(0, 0, w, h);

    const pad = { top: 30, right: 65, bottom: 35, left: 180 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    // Draw X-axis grid lines (50% to 100%)
    ctx.save();
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.fillStyle = '#64748b';
    ctx.lineWidth = 1;

    const xSteps = [60, 70, 80, 90, 100];
    xSteps.forEach(val => {
      const x = pad.left + ((val - 50) / 50) * chartW;
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + chartH);
      ctx.stroke();

      ctx.fillText(`${val}%`, x, pad.top + chartH + 8);
    });
    ctx.restore();

    const active = this.getActiveModelsList();
    if (active.length === 0) {
      this.drawEmptyNotice(ctx, w, h, 'No models selected');
      return;
    }

    // Sort models by selected metric descending
    const sorted = [...active].sort(
      (a, b) => (b.metrics[this.activeMetric] || 0) - (a.metrics[this.activeMetric] || 0)
    );

    const slotH = chartH / sorted.length;
    const barH = Math.min(22, slotH * 0.65);

    sorted.forEach((model, idx) => {
      const score = model.metrics[this.activeMetric] || 0;
      const targetW = ((score - 50) / 50) * chartW;
      const animatedW = targetW * this.animProgress;

      const y = pad.top + (idx + 0.5) * slotH - barH / 2;
      const isHovered = this.metricHoverModelId === model.id;

      // Model label on Y-axis
      ctx.save();
      ctx.font = isHovered ? 'bold 12px "Inter", sans-serif' : '500 12px "Inter", sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isHovered ? '#38bdf8' : '#cbd5e1';
      ctx.fillText(model.name, pad.left - 26, y + barH / 2);

      // Official Model Brand Icon Badge
      this.drawModelIconBadge(ctx, model.id, pad.left - 13, y + barH / 2, 9, model.color, isHovered);
      ctx.restore();

      // Bar fill with subtle gradient
      ctx.save();
      if (isHovered) {
        ctx.shadowColor = model.color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ffffff';
      } else {
        const grad = ctx.createLinearGradient(pad.left, 0, pad.left + animatedW, 0);
        grad.addColorStop(0, this.hexToRgba(model.color, 0.45));
        grad.addColorStop(1, model.color);
        ctx.fillStyle = grad;
      }

      this.drawRoundedHBar(ctx, pad.left, y, animatedW, barH, 4);

      // Value label at tip of bar
      if (this.animProgress > 0.8) {
        ctx.save();
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isHovered ? '#38bdf8' : '#e2e8f0';
        ctx.fillText(`${score.toFixed(1)}%`, pad.left + animatedW + 8, y + barH / 2);
        ctx.restore();
      }
      ctx.restore();
    });
  }

  handleMetricMouseMove(e) {
    const canvas = this.metricCanvas;
    if (!canvas || !canvas._w) return;
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;

    const pad = { top: 30, right: 65, bottom: 35, left: 180 };
    const chartH = canvas._h - pad.top - pad.bottom;
    const active = this.getActiveModelsList();
    if (active.length === 0) return;

    const sorted = [...active].sort(
      (a, b) => (b.metrics[this.activeMetric] || 0) - (a.metrics[this.activeMetric] || 0)
    );

    const slotH = chartH / sorted.length;
    let hovered = null;

    sorted.forEach((model, idx) => {
      const topY = pad.top + idx * slotH;
      const botY = topY + slotH;
      if (mouseY >= topY && mouseY <= botY) {
        hovered = model;
      }
    });

    if (hovered && hovered.id !== this.metricHoverModelId) {
      this.metricHoverModelId = hovered.id;
      this.renderMetricGraph();
      this.showMetricTooltip(hovered, e.clientX, e.clientY);
    } else if (!hovered) {
      this.metricHoverModelId = null;
      this.renderMetricGraph();
      this.hideMetricTooltip();
    }
  }

  handleMetricMouseLeave() {
    this.metricHoverModelId = null;
    this.renderMetricGraph();
    this.hideMetricTooltip();
  }

  showMetricTooltip(model, clientX, clientY) {
    const tt = this.metricTooltip;
    if (!tt) return;

    const score = model.metrics[this.activeMetric] || 0;

    tt.innerHTML = `
      <div class="tt-header">
        <span class="tt-color-dot" style="background: ${model.color};"></span>
        <strong>${model.name}</strong>
        <span class="tt-sub">${model.badge}</span>
      </div>
      <div class="tt-metric-line">
        <span>Metric: <strong>${this.activeMetric}</strong></span>
        <span style="color: #38bdf8; font-weight: 700;">${score.toFixed(1)}%</span>
      </div>
    `;

    tt.style.display = 'block';
    const containerRect = this.metricCanvas.parentElement.getBoundingClientRect();
    let left = clientX - containerRect.left + 14;
    let top = clientY - containerRect.top - 20;
    if (left + 180 > this.metricCanvas._w) left = clientX - containerRect.left - 190;

    tt.style.left = `${left}px`;
    tt.style.top = `${top}px`;
  }

  hideMetricTooltip() {
    if (this.metricTooltip) this.metricTooltip.style.display = 'none';
  }

  /* ==========================================================================
     GRAPH 3: Performance Variation Across Generations
     ========================================================================== */
  renderGenGraph() {
    const canvas = this.genCanvas;
    if (!canvas || !canvas._w || !canvas._h) return;
    const ctx = canvas.getContext('2d');
    const w = canvas._w;
    const h = canvas._h;

    ctx.clearRect(0, 0, w, h);

    const pad = { top: 30, right: 35, bottom: 45, left: 180 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    const yMin = 70;
    const yMax = 98;

    // Y-axis grid
    ctx.save();
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.fillStyle = '#64748b';
    ctx.lineWidth = 1;

    const ySteps = [70, 75, 80, 85, 90, 95];
    ySteps.forEach(val => {
      const y = pad.top + chartH - ((val - yMin) / (yMax - yMin)) * chartH;
      ctx.beginPath();
      ctx.setLineDash([3, 4]);
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + chartW, y);
      ctx.stroke();

      ctx.fillText(`${val}%`, 30, y);
    });

    // Vertical Y-axis line at pad.left
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + chartH);
    ctx.stroke();
    ctx.restore();

    // X-axis points (Gen 1 to Gen 8)
    const numPoints = GENERATION_POINTS.length;
    const xStep = chartW / (numPoints - 1);

    ctx.save();
    ctx.font = '600 11px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillStyle = '#94a3b8';

    GENERATION_POINTS.forEach((label, idx) => {
      const x = pad.left + idx * xStep;
      ctx.beginPath();
      ctx.setLineDash([2, 4]);
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + chartH);
      ctx.stroke();

      ctx.fillText(label, x, pad.top + chartH + 10);
    });
    ctx.restore();

    const active = this.getActiveModelsList();
    if (active.length === 0) {
      this.drawEmptyNotice(ctx, w, h, 'No models selected');
      return;
    }

    // Render Generation Curves
    active.forEach(model => {
      const pts = model.generations.map((val, idx) => {
        const x = pad.left + idx * xStep;
        const targetY = pad.top + chartH - ((val - yMin) / (yMax - yMin)) * chartH;
        const baseY = pad.top + chartH;
        const y = baseY - (baseY - targetY) * this.animProgress;
        return { x, y, val };
      });

      // Line Stroke
      ctx.save();
      ctx.beginPath();
      this.drawSmoothCurve(ctx, pts);
      ctx.strokeStyle = model.color;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Points
      pts.forEach((pt, pIdx) => {
        ctx.beginPath();
        const isHovered = this.genHoverGenIdx === pIdx;
        ctx.arc(pt.x, pt.y, isHovered ? 4.5 : 2.8, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#ffffff' : model.color;
        ctx.fill();
      });
      ctx.restore();
    });

    // Scanline crosshair
    if (this.genHoverGenIdx >= 0 && this.genHoverGenIdx < numPoints) {
      const hX = pad.left + this.genHoverGenIdx * xStep;
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.moveTo(hX, pad.top);
      ctx.lineTo(hX, pad.top + chartH);
      ctx.stroke();
      ctx.restore();
    }

    // Direct Model Name Labels on the Left Side of Each Curve (Origin / Gen 1)
    this.drawCurveStartLabels(ctx, active, pad, chartW, chartH, yMin, yMax, m => m.generations[0]);
  }

  handleGenMouseMove(e) {
    const canvas = this.genCanvas;
    if (!canvas || !canvas._w) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const pad = { top: 30, right: 35, bottom: 45, left: 180 };
    const chartW = canvas._w - pad.left - pad.right;
    const numPoints = GENERATION_POINTS.length;
    const xStep = chartW / (numPoints - 1);

    let closestIdx = -1;
    let minDiff = Infinity;
    for (let i = 0; i < numPoints; i++) {
      const ptX = pad.left + i * xStep;
      const diff = Math.abs(ptX - mouseX);
      if (diff < minDiff && diff < xStep * 0.75) {
        minDiff = diff;
        closestIdx = i;
      }
    }

    if (closestIdx !== this.genHoverGenIdx) {
      this.genHoverGenIdx = closestIdx;
      this.renderGenGraph();
      if (closestIdx >= 0) {
        this.showGenTooltip(closestIdx, e.clientX, e.clientY);
      } else {
        this.hideGenTooltip();
      }
    } else if (closestIdx >= 0) {
      this.showGenTooltip(closestIdx, e.clientX, e.clientY);
    }
  }

  handleGenMouseLeave() {
    this.genHoverGenIdx = -1;
    this.renderGenGraph();
    this.hideGenTooltip();
  }

  showGenTooltip(genIdx, clientX, clientY) {
    const tt = this.genTooltip;
    if (!tt) return;

    const active = this.getActiveModelsList();
    if (active.length === 0) return;

    const ranked = active
      .map(m => ({
        name: m.name,
        color: m.color,
        val: m.generations[genIdx]
      }))
      .sort((a, b) => b.val - a.val);

    const rowsHtml = ranked
      .map(
        r => `
        <div class="tt-model-row">
          <span class="tt-color-dot" style="background: ${r.color};"></span>
          <span class="tt-model-name">${r.name}</span>
          <span class="tt-model-score">${r.val.toFixed(1)}%</span>
        </div>`
      )
      .join('');

    tt.innerHTML = `
      <div class="tt-header">
        <strong>${GENERATION_POINTS[genIdx]}</strong>
        <span class="tt-sub">Evolutionary Trend</span>
      </div>
      <div class="tt-body">
        ${rowsHtml}
      </div>
    `;

    tt.style.display = 'block';
    const containerRect = this.genCanvas.parentElement.getBoundingClientRect();
    let left = clientX - containerRect.left + 16;
    let top = clientY - containerRect.top - 20;
    if (left + 220 > this.genCanvas._w) left = clientX - containerRect.left - 230;

    tt.style.left = `${left}px`;
    tt.style.top = `${top}px`;
  }

  hideGenTooltip() {
    if (this.genTooltip) this.genTooltip.style.display = 'none';
  }

  /* ==========================================================================
     Helper Utilities
     ========================================================================== */
  drawSmoothCurve(ctx, pts) {
    if (pts.length < 2) return;
    ctx.moveTo(pts[0].x, pts[0].y);

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[0];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i != pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
  }

  drawRoundedHBar(ctx, x, y, width, height, radius) {
    if (width <= 0) return;
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.fill();
  }

  drawEmptyNotice(ctx, w, h, text) {
    ctx.save();
    ctx.font = '500 13px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#64748b';
    ctx.fillText(text, w / 2, h / 2);
    ctx.restore();
  }

  drawModelIconBadge(ctx, modelId, cx, cy, radius = 9, modelColor = '#ffffff', isHovered = false) {
    ctx.save();

    // 1. Circular dark glass badge backing
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = isHovered 
      ? this.hexToRgba(modelColor, 0.28) 
      : 'rgba(15, 23, 42, 0.88)';
    ctx.fill();

    // 2. Glowing perimeter border matching model brand
    ctx.strokeStyle = isHovered ? modelColor : this.hexToRgba(modelColor, 0.55);
    ctx.lineWidth = isHovered ? 1.5 : 1;
    if (isHovered) {
      ctx.shadowColor = modelColor;
      ctx.shadowBlur = 8;
    }
    ctx.stroke();

    // 3. Official Vector SVG Logo inside badge
    const iconSize = radius * 1.35;
    const scale = iconSize / 24;
    ctx.save();
    ctx.translate(cx - iconSize / 2, cy - iconSize / 2);
    ctx.scale(scale, scale);

    const iconColor = isHovered ? '#ffffff' : modelColor;
    ctx.fillStyle = iconColor;

    if (modelId === 'oxalfa') {
      ctx.beginPath();
      ctx.arc(12, 12, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = iconColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(12, 12, 9, 4, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(12, 12, 9, 4, -Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const path = MODEL_CANVAS_PATHS[modelId];
      if (path) {
        ctx.fill(path);
      } else {
        ctx.beginPath();
        ctx.arc(12, 12, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
    ctx.restore();
  }

  drawCurveStartLabels(ctx, activeModels, pad, chartW, chartH, yMin, yMax, getValFn) {
    if (!activeModels || activeModels.length === 0) return;

    const startLabels = activeModels.map(model => {
      const startVal = getValFn(model);
      const targetY = pad.top + chartH - ((startVal - yMin) / (yMax - yMin)) * chartH;
      const baseY = pad.top + chartH;
      const y = baseY - (baseY - targetY) * this.animProgress;
      return {
        id: model.id,
        name: model.name,
        color: model.color,
        val: startVal,
        origY: y,
        y: y
      };
    });

    // Sort by Y ascending (highest score at top)
    startLabels.sort((a, b) => a.origY - b.origY);

    // Iterative collision avoidance: ensure minimum 17px gap between adjacent labels
    const minGap = 17;
    for (let iter = 0; iter < 12; iter++) {
      for (let i = 0; i < startLabels.length - 1; i++) {
        const cur = startLabels[i];
        const nxt = startLabels[i + 1];
        if (nxt.y - cur.y < minGap) {
          const overlap = minGap - (nxt.y - cur.y);
          cur.y -= overlap * 0.5;
          nxt.y += overlap * 0.5;
        }
      }
    }

    // Clamp within chart bounds
    startLabels.forEach(lbl => {
      lbl.y = Math.max(pad.top + 6, Math.min(pad.top + chartH - 4, lbl.y));
    });

    const startX = pad.left;

    startLabels.forEach(lbl => {
      // Subtle leader line if shifted vertically from starting origin
      if (Math.abs(lbl.y - lbl.origY) > 2) {
        ctx.save();
        ctx.strokeStyle = this.hexToRgba(lbl.color, 0.45);
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(startX - 2, lbl.origY);
        ctx.lineTo(startX - 24, lbl.y);
        ctx.stroke();
        ctx.restore();
      }

      // Official Model Brand Icon Badge
      this.drawModelIconBadge(ctx, lbl.id, startX - 13, lbl.y, 8.5, lbl.color, false);

      // Model Name right-aligned at pad.left - 26
      ctx.save();
      ctx.font = '600 11px "Inter", sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = lbl.color;
      ctx.fillText(lbl.name, startX - 26, lbl.y);
      ctx.restore();
    });
  }

  hexToRgba(hex, alpha) {
    const clean = hex.replace('#', '');
    let r = 0, g = 0, b = 0;
    if (clean.length === 3) {
      r = parseInt(clean[0] + clean[0], 16);
      g = parseInt(clean[1] + clean[1], 16);
      b = parseInt(clean[2] + clean[2], 16);
    } else if (clean.length === 6) {
      r = parseInt(clean.substring(0, 2), 16);
      g = parseInt(clean.substring(2, 4), 16);
      b = parseInt(clean.substring(4, 6), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

// Global Exports
window.ModelVariationAnalytics = ModelVariationAnalytics;
window.AI_ANALYTICS_MODELS = AI_ANALYTICS_MODELS;
window.EVALUATION_POINTS = EVALUATION_POINTS;
window.GENERATION_POINTS = GENERATION_POINTS;
window.METRICS_LIST = METRICS_LIST;

export {
  ModelVariationAnalytics,
  AI_ANALYTICS_MODELS,
  EVALUATION_POINTS,
  GENERATION_POINTS,
  METRICS_LIST
};
export default ModelVariationAnalytics;
