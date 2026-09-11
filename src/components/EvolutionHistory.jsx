import React, { useState } from 'react';
import { History, Check, X, Shield } from 'lucide-react';

/**
 * EvolutionHistory Component
 * Section 7: Displays architecture versions in a clean timeline / table.
 * Shows:
 * - Version / Generation #
 * - Baseline Score
 * - Mutation Attempted
 * - Candidate Score
 * - Final Decision (ACCEPTED / REJECTED)
 * - Resulting Architecture Version
 * - Rationale
 * 
 * Uses Lucide React icons.
 */
export default function EvolutionHistory({ history = [] }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'ACCEPTED' | 'REJECTED'

  const filteredHistory = history.filter((item) => {
    if (filter === 'ACCEPTED') return item.decision === 'ACCEPTED';
    if (filter === 'REJECTED') return item.decision === 'REJECTED';
    return true;
  });

  const acceptedCount = history.filter((h) => h.decision === 'ACCEPTED').length;
  const rejectedCount = history.filter((h) => h.decision === 'REJECTED').length;

  return (
    <section id="evolution-history" className="dashboard-section card evolution-history-card">
      <div className="section-header-row">
        <div className="section-title-wrap">
          <div className="section-icon-badge icon-cyan">
            <History size={20} strokeWidth={2} color="#00f0ff" />
          </div>
          <div>
            <h2 className="section-heading">EVOLUTION HISTORY</h2>
            <p className="section-subheading">
              Chronological Audit Trail of All Evaluated Architecture Mutations
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="history-filter-tabs">
          <button
            className={`filter-tab-btn ${filter === 'ALL' ? 'tab-active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All Cycles ({history.length})
          </button>
          <button
            className={`filter-tab-btn ${filter === 'ACCEPTED' ? 'tab-active' : ''}`}
            onClick={() => setFilter('ACCEPTED')}
          >
            Accepted ({acceptedCount})
          </button>
          <button
            className={`filter-tab-btn ${filter === 'REJECTED' ? 'tab-active' : ''}`}
            onClick={() => setFilter('REJECTED')}
          >
            Rejected ({rejectedCount})
          </button>
        </div>
      </div>

      {/* Visual Timeline Chips Ribbon */}
      {history.length > 0 && (
        <div className="timeline-ribbon-container">
          <div className="timeline-track">
            {history.map((item, idx) => (
              <div key={item.id || idx} className={`timeline-node ${item.decision === 'ACCEPTED' ? 'node-accepted' : 'node-rejected'}`}>
                <div className="node-badge-gen font-mono">Gen #{item.generation}</div>
                <div className="node-decision font-mono">{item.decision}</div>
                <div className="node-score font-mono text-cyan">{item.newPerf}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Architecture Version Table */}
      <div className="table-responsive">
        <table className="evolution-history-table font-mono">
          <thead>
            <tr>
              <th>Version / Gen</th>
              <th>Current Score</th>
              <th>Mutation Tested</th>
              <th>New Score</th>
              <th>Decision</th>
              <th>Resulting Architecture</th>
              <th>Simple Explanation</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-history-cell">
                  No mutation records match the selected filter.
                </td>
              </tr>
            ) : (
              filteredHistory.map((item) => (
                <tr key={item.id} className={item.decision === 'ACCEPTED' ? 'row-accepted' : 'row-rejected'}>
                  <td className="text-cyan font-bold">
                    <span>v{item.generation}.0</span>
                    <span className="gen-sub">Gen #{item.generation}</span>
                  </td>
                  <td>{item.currentPerf}</td>
                  <td className="text-purple">{item.mutation}</td>
                  <td>
                    <strong className={item.decision === 'ACCEPTED' ? 'text-emerald' : 'text-rose'}>
                      {item.newPerf}
                    </strong>
                  </td>
                  <td>
                    <span className={`hist-decision-pill ${item.decision === 'ACCEPTED' ? 'pill-accepted' : item.decision === 'REJECTED' ? 'pill-rejected' : 'pill-stable'}`}>
                      {item.decision === 'ACCEPTED' ? (
                        <Check size={11} strokeWidth={2.5} />
                      ) : item.decision === 'REJECTED' ? (
                        <X size={11} strokeWidth={2.5} />
                      ) : (
                        <Shield size={11} strokeWidth={2} />
                      )}
                      <span>{item.decision}</span>
                    </span>
                  </td>
                  <td className="text-secondary font-mono">{item.architecture}</td>
                  <td className="history-reason-cell" style={{ fontFamily: 'var(--font-sans)' }}>
                    {item.reason}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
