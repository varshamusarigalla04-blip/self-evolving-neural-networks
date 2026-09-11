import React from 'react';
import { 
  Activity, 
  Target, 
  TrendingDown, 
  Zap, 
  Compass, 
  Radio, 
  Scale, 
  Cpu, 
  Layers 
} from 'lucide-react';
import MetricCard from './MetricCard.jsx';

/**
 * PerformanceMetrics Component
 * Clean, consistent 8-card metric grid:
 * Row 1: Accuracy | Precision | Recall | F1 Score
 * Row 2: Loss | Performance | Neurons | Hidden Layers
 * 
 * All cards visually consistent with subtle Lucide icons, small supporting labels,
 * and prominent numerical values.
 */
export default function PerformanceMetrics({ 
  metrics = {
    accuracy: 72.0,
    precision: 71.4,
    recall: 72.8,
    f1Score: 72.1,
    loss: 0.380,
    performanceScore: 72.0,
    neuronCount: 14,
    hiddenLayerCount: 2
  },
  deltas = {
    accuracy: '+4.0%',
    precision: '+3.8%',
    recall: '+4.2%',
    f1Score: '+4.0%',
    loss: '-0.035',
    performanceScore: '+4.0%',
    neuronCount: '+2',
    hiddenLayerCount: '0'
  }
}) {
  return (
    <section id="performance-section" className="dashboard-section card metrics-section-card">
      {/* Section Header */}
      <div className="section-header-row">
        <div className="section-title-wrap">
          <div className="section-icon-badge icon-emerald">
            <Activity size={18} strokeWidth={2.2} color="#10b981" />
          </div>
          <div>
            <h2 className="section-heading">PERFORMANCE METRICS</h2>
            <p className="section-subheading">
              Empirical evaluation telemetry across accuracy, loss, and topological capacity
            </p>
          </div>
        </div>

        <div className="demo-disclaimer-pill">
          <span className="disclaimer-dot" />
          <span>Simulated Benchmark Telemetry</span>
        </div>
      </div>

      {/* Consistent 8-Card Metric Grid (4 cols x 2 rows on desktop) */}
      <div className="metrics-uniform-grid">
        {/* Row 1: Accuracy, Precision, Recall, F1 Score */}
        <MetricCard
          label="Accuracy"
          value={`${metrics.accuracy.toFixed(1)}%`}
          delta={deltas.accuracy}
          isPositive={true}
          icon={<Target size={16} strokeWidth={2.2} color="#00f0ff" />}
          color="cyan"
          progress={metrics.accuracy}
          subtext="Validation benchmark"
        />

        <MetricCard
          label="Precision"
          value={`${metrics.precision.toFixed(1)}%`}
          delta={deltas.precision}
          isPositive={true}
          icon={<Compass size={16} strokeWidth={2.2} color="#00f0ff" />}
          color="cyan"
          progress={metrics.precision}
          subtext="True positive rate"
        />

        <MetricCard
          label="Recall"
          value={`${metrics.recall.toFixed(1)}%`}
          delta={deltas.recall}
          isPositive={true}
          icon={<Radio size={16} strokeWidth={2.2} color="#10b981" />}
          color="emerald"
          progress={metrics.recall}
          subtext="Sensitivity rate"
        />

        <MetricCard
          label="F1 Score"
          value={`${metrics.f1Score.toFixed(1)}%`}
          delta={deltas.f1Score}
          isPositive={true}
          icon={<Scale size={16} strokeWidth={2.2} color="#10b981" />}
          color="emerald"
          progress={metrics.f1Score}
          subtext="Harmonic mean (P & R)"
        />

        {/* Row 2: Loss, Performance, Neurons, Hidden Layers */}
        <MetricCard
          label="Loss"
          value={metrics.loss.toFixed(3)}
          delta={deltas.loss}
          isPositive={false}
          icon={<TrendingDown size={16} strokeWidth={2.2} color="#f43f5e" />}
          color="rose"
          progress={Math.max(10, Math.min(100, (metrics.loss / 0.8) * 100))}
          subtext="Cross-entropy error"
        />

        <MetricCard
          label="Performance"
          value={`${metrics.performanceScore.toFixed(1)} / 100`}
          delta={deltas.performanceScore}
          isPositive={true}
          icon={<Zap size={16} strokeWidth={2.2} color="#10b981" />}
          color="emerald"
          progress={metrics.performanceScore}
          subtext="Composite fitness"
        />

        <MetricCard
          label="Neurons"
          value={metrics.neuronCount}
          delta={deltas.neuronCount}
          isPositive={true}
          icon={<Cpu size={16} strokeWidth={2.2} color="#f59e0b" />}
          color="amber"
          progress={Math.min(100, (metrics.neuronCount / 24) * 100)}
          subtext="Active network nodes"
        />

        <MetricCard
          label="Hidden Layers"
          value={metrics.hiddenLayerCount}
          delta={deltas.hiddenLayerCount}
          isPositive={true}
          icon={<Layers size={16} strokeWidth={2.2} color="#a855f7" />}
          color="purple"
          progress={Math.min(100, (metrics.hiddenLayerCount / 4) * 100)}
          subtext="Intermediate depth"
        />
      </div>
    </section>
  );
}
