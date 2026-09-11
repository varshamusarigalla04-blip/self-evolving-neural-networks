import React from 'react';
import { Activity } from 'lucide-react';

/**
 * MetricCard Component
 * Reusable, clean metric card with consistent height, prominent numerical value,
 * subtle Lucide icon badge, small delta tag, and clean progress bar.
 */
export default function MetricCard({ 
  label, 
  value, 
  delta, 
  isPositive = true, 
  unit = '', 
  icon = <Activity size={16} strokeWidth={2} />, 
  color = 'cyan',
  progress = 50,
  subtext = '' 
}) {
  return (
    <div className={`metric-card-box metric-color-${color}`}>
      {/* Top row: Subtle Icon + Delta Tag */}
      <div className="metric-top-row">
        <span className="metric-icon-bubble">{icon}</span>
        {delta && (
          <span className={`metric-delta-pill ${isPositive ? 'delta-pos' : 'delta-neg'}`}>
            {delta}
          </span>
        )}
      </div>

      {/* Main value & label */}
      <div className="metric-body">
        <div className="metric-num-display">
          <span className="metric-main-value font-mono">{value}</span>
          {unit && <span className="metric-unit-text">{unit}</span>}
        </div>
        <span className="metric-name-text">{label}</span>
      </div>

      {/* Mini Progress Bar */}
      {typeof progress === 'number' && (
        <div className="metric-progress-wrapper">
          <div 
            className={`metric-progress-bar-fill fill-${color}`}
            style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
          />
        </div>
      )}

      {/* Footer: Supporting subtext */}
      <div className="metric-footer-row">
        <span className="metric-subtext-note">{subtext}</span>
      </div>
    </div>
  );
}
