/**
 * src/services/chartsEngine.js
 * Lightweight Zero-Dependency Performance Trend Canvas Chart
 */

import { AppState } from './state.js';

export class PerformanceChart {
  constructor(canvasOrId) {
    if (typeof canvasOrId === 'string') {
      this.canvas = document.getElementById(canvasOrId);
    } else {
      this.canvas = canvasOrId;
    }

    if (!this.canvas) {
      console.error(`Chart canvas ${canvasOrId} not found.`);
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.hoverIndex = -1;

    this.init();
  }

  init() {
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    this.handleMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      this.updateHover(mouseX);
    };

    this.handleMouseLeave = () => {
      this.hoverIndex = -1;
      this.render();
    };

    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    }
  }

  handleResize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const width = parent ? parent.clientWidth : 600;
    const height = 240;

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.width = width;
    this.height = height;

    this.render();
  }

  updateHover(mouseX) {
    const data = AppState.trendData;
    const count = data.generations.length;
    if (count < 2) return;

    const padding = { top: 25, right: 30, bottom: 35, left: 45 };
    const chartW = this.width - padding.left - padding.right;

    let closestIdx = 0;
    let minDiff = Infinity;

    for (let i = 0; i < count; i++) {
      const px = padding.left + (i / (count - 1)) * chartW;
      const diff = Math.abs(px - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }

    if (this.hoverIndex !== closestIdx) {
      this.hoverIndex = closestIdx;
      this.render();
    }
  }

  render() {
    const ctx = this.ctx;
    if (!ctx || !this.width || !this.height) return;

    ctx.clearRect(0, 0, this.width, this.height);

    const data = AppState.trendData;
    const count = data.generations.length;
    const padding = { top: 25, right: 30, bottom: 35, left: 45 };
    const chartW = this.width - padding.left - padding.right;
    const chartH = this.height - padding.top - padding.bottom;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    ctx.font = '10px monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let p = 0; p <= 100; p += 25) {
      const y = padding.top + chartH - (p / 100) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(this.width - padding.right, y);
      ctx.stroke();
      ctx.fillText(`${p}%`, padding.left - 8, y);
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartH);
    ctx.lineTo(this.width - padding.right, padding.top + chartH);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const stepGen = Math.max(1, Math.floor(count / 6));
    for (let i = 0; i < count; i += stepGen) {
      const x = count === 1 ? padding.left : padding.left + (i / (count - 1)) * chartW;
      ctx.fillText(`Gen ${data.generations[i]}`, x, padding.top + chartH + 8);
    }
    if (count > 1 && (count - 1) % stepGen !== 0) {
      const x = padding.left + chartW;
      ctx.fillText(`Gen ${data.generations[count - 1]}`, x, padding.top + chartH + 8);
    }

    const targetVal = AppState.config.performanceThreshold || 85;
    const targetY = padding.top + chartH - (targetVal / 100) * chartH;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padding.left, targetY);
    ctx.lineTo(this.width - padding.right, targetY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'right';
    ctx.fillText(`Target (${targetVal})`, this.width - padding.right, targetY - 6);

    ctx.restore();

    if (count < 1) return;

    const plotLine = (values, strokeColor, glowColor) => {
      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 8;
      ctx.beginPath();

      for (let i = 0; i < count; i++) {
        const val = Math.max(0, Math.min(100, values[i]));
        const x = count === 1 ? padding.left + chartW / 2 : padding.left + (i / (count - 1)) * chartW;
        const y = padding.top + chartH - (val / 100) * chartH;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      for (let i = 0; i < count; i++) {
        const val = Math.max(0, Math.min(100, values[i]));
        const x = count === 1 ? padding.left + chartW / 2 : padding.left + (i / (count - 1)) * chartW;
        const y = padding.top + chartH - (val / 100) * chartH;

        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = strokeColor;
        ctx.fill();
      }
      ctx.restore();
    };

    plotLine(data.accuracies, '#10b981', '#34d399');
    plotLine(data.fitnessScores, '#06b6d4', '#22d3ee');

    if (this.hoverIndex >= 0 && this.hoverIndex < count) {
      const i = this.hoverIndex;
      const x = count === 1 ? padding.left + chartW / 2 : padding.left + (i / (count - 1)) * chartW;

      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + chartH);
      ctx.stroke();
      ctx.setLineDash([]);

      const gen = data.generations[i];
      const fit = data.fitnessScores[i];
      const acc = data.accuracies[i];
      const loss = data.losses[i];

      const tooltipText = `Gen ${gen} | Fit: ${fit} | Acc: ${acc}% | Loss: ${loss}`;
      ctx.font = '11px monospace';
      const tw = ctx.measureText(tooltipText).width + 16;
      let tx = x - tw / 2;
      if (tx < padding.left) tx = padding.left;
      if (tx + tw > this.width - padding.right) tx = this.width - padding.right - tw;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(tx, 5, tw, 22, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'left';
      ctx.fillText(tooltipText, tx + 8, 19);
      ctx.restore();
    }
  }
}

if (typeof window !== 'undefined') {
  window.PerformanceChart = PerformanceChart;
}

export default PerformanceChart;
