import React, { useState } from 'react';
import { BarChart2, Table, Eye, Hash, Type } from 'lucide-react';
import type { OfficeState } from '../hooks/useOffice.js';

interface ColumnProfile {
  name: string;
  inferredType: 'number' | 'string' | 'empty';
  nullCount: number;
  nullPercentage: string;
  stats?: {
    count: number;
    mean: string;
    min: number | null;
    max: number | null;
  };
}

export function AnalyzeTab({ officeState }: { officeState: OfficeState }) {
  const { selectedRange, adapter, refreshContext } = officeState;
  const [profiles, setProfiles] = useState<ColumnProfile[]>([]);
  const [isProfiling, setIsProfiling] = useState(false);

  const handleProfile = async () => {
    await refreshContext();
    if (!selectedRange) return;

    setIsProfiling(true);
    try {
      const response = await fetch('/api/v1/excel/profile-range', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headers: selectedRange.headers || [],
          values: selectedRange.values
        })
      });

      if (response.ok) {
        const json = await response.json();
        setProfiles(json.data.columnProfiles);
      }
    } catch (err) {
      console.error('Error profiling range:', err);
    } finally {
      setIsProfiling(false);
    }
  };

  const headers = selectedRange?.headers || [];
  const rows = selectedRange?.values.slice(0, 5) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Table size={14} color="#58a6ff" />
            <span>Active Range Inspection</span>
          </div>
          <button
            onClick={handleProfile}
            disabled={isProfiling}
            className="btn btn-primary"
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            <Eye size={12} />
            <span>{isProfiling ? 'Analyzing...' : 'Profile Range'}</span>
          </button>
        </div>

        {selectedRange ? (
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Showing preview of <strong>{selectedRange.range.address}</strong> (
              {selectedRange.range.rowCount} rows, {selectedRange.range.columnCount} columns)
            </div>

            <div
              style={{
                maxHeight: '140px',
                overflowY: 'auto',
                overflowX: 'auto',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)'
              }}
            >
              <table className="data-table-preview">
                <thead>
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx}>{cell !== null && cell !== undefined ? String(cell) : '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedRange.values.length > 5 && (
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'center' }}>
                + {selectedRange.values.length - 5} more rows loaded
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', padding: '12px' }}>
            Select a range in Excel or click Profile Range.
          </div>
        )}
      </div>

      {profiles.length > 0 && (
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart2 size={14} color="#10b981" />
            <span>Statistical Column Summary</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {profiles.map((p, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 600, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {p.inferredType === 'number' ? <Hash size={11} color="#58a6ff" /> : <Type size={11} color="#8b949e" />}
                    <span>{p.name}</span>
                  </div>
                  <span
                    className={`badge ${p.inferredType === 'number' ? 'badge-safe' : 'badge-warning'}`}
                    style={{ fontSize: '9px', textTransform: 'uppercase' }}
                  >
                    {p.inferredType}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: 'var(--text-secondary)' }}>
                  <span>Nulls: {p.nullCount} ({p.nullPercentage}%)</span>
                  {p.stats && (
                    <>
                      <span>Mean: <strong style={{ color: 'var(--text-primary)' }}>{p.stats.mean}</strong></span>
                      <span>Min: {p.stats.min}</span>
                      <span>Max: {p.stats.max}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
