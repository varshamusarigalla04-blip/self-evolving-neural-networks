import React from 'react';

export default function EvolutionHistory({ historyDecisions }) {
  const keepCount = historyDecisions.filter(h => h.decision === 'Keep').length;
  const mutateCount = historyDecisions.filter(h => h.decision === 'Mutate').length;
  const rejectCount = historyDecisions.filter(h => h.decision === 'Reject').length;

  return (
    <section id="evolution-history-decision" className="card">
      <div className="card-header">
        <div className="card-title-wrap">
          <span className="card-icon">📜</span>
          <div>
            <h2 className="card-title">Evolution History &amp; Decision</h2>
            <div className="card-subtitle">
              Timeline of architecture mutations, evaluated scores, reasons, and Keep / Mutate / Reject decisions
            </div>
          </div>
        </div>

        {/* Quick Stats Counter */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            Cycles: <strong style={{ color: '#fff' }}>{historyDecisions.length}</strong>
          </span>
          <span style={{ fontSize: '0.74rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            Keep: {keepCount}
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--accent-cyan-light)', background: 'rgba(14, 165, 233, 0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-focus)' }}>
            Mutate: {mutateCount}
          </span>
          <span style={{ fontSize: '0.74rem', color: '#fb7185', background: 'rgba(244, 63, 94, 0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
            Reject: {rejectCount}
          </span>
        </div>
      </div>

      {/* Comprehensive Decision History Table */}
      <div className="history-table-scroll">
        <table className="evolution-table">
          <thead>
            <tr>
              <th>Generation</th>
              <th>Architecture Change</th>
              <th>Performance</th>
              <th>Mutation Performed</th>
              <th>Reason for Mutation</th>
              <th style={{ minWidth: '130px' }}>Decision</th>
              <th>Improvement</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {historyDecisions.map((row, idx) => {
              let badgeClass = 'initial';
              let icon = '●';
              if (row.decision === 'Keep') {
                badgeClass = 'keep';
                icon = '✓';
              } else if (row.decision === 'Mutate') {
                badgeClass = 'mutate';
                icon = '⚡';
              } else if (row.decision === 'Reject') {
                badgeClass = 'reject';
                icon = '✗';
              }

              return (
                <tr key={idx}>
                  <td className="col-gen">Gen {row.generation}</td>
                  <td className="col-arch" style={{ fontSize: '0.82rem' }}>{row.archChange}</td>
                  <td style={{ color: 'var(--accent-cyan-light)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {row.performance}
                  </td>
                  <td style={{ color: '#fff', fontWeight: 600 }}>{row.mutation}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: '320px' }}>
                    {row.reason}
                  </td>
                  <td>
                    <span className={`badge-decision ${badgeClass}`}>
                      <span>{icon}</span>
                      <span>{row.decision}</span>
                    </span>
                  </td>
                  <td style={{ 
                    fontWeight: 700, 
                    fontFamily: 'var(--font-mono)',
                    color: row.improvement.startsWith('+') ? 'var(--accent-emerald-light)' : row.improvement.startsWith('-') ? 'var(--accent-rose)' : 'var(--text-secondary)'
                  }}>
                    {row.improvement}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                    {row.timestamp}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
