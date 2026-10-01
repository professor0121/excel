import React, { useState } from 'react';
import { LineChart, CheckCircle, PieChart } from 'lucide-react';
import type { OfficeState } from '../hooks/useOffice.js';
import type { ExcelChartType } from '@gemini-datalab/excel-engine';

interface VisualizeTabProps {
  officeState: OfficeState;
  onLogAction: (action: string, details: string) => void;
}

export function VisualizeTab({ officeState, onLogAction }: VisualizeTabProps) {
  const { adapter, selectedRange, refreshContext } = officeState;

  const defaultRange = selectedRange?.range.address || 'A1:F9';
  const [dataRange, setDataRange] = useState(defaultRange);
  const [chartTitle, setChartTitle] = useState('Revenue by Category');
  const [chartType, setChartType] = useState<ExcelChartType>('ColumnClustered');
  const [positionCell, setPositionCell] = useState('H2');
  const [isInserting, setIsInserting] = useState(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  const handleCreateChart = async () => {
    setIsInserting(true);
    setResultMsg(null);
    try {
      const result = await adapter.createChart({
        title: chartTitle,
        chartType,
        dataRange,
        positionCell
      });
      await refreshContext();
      setResultMsg(result.message);
      onLogAction('CREATE_CHART', `Created ${chartType} chart "${chartTitle}" at ${positionCell}`);
    } catch (err: unknown) {
      setResultMsg(`Failed to create chart: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsInserting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {resultMsg && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            background: 'rgba(35, 134, 54, 0.2)',
            border: '1px solid rgba(46, 160, 67, 0.4)',
            color: '#3fb950',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <CheckCircle size={13} />
          <span>{resultMsg}</span>
        </div>
      )}

      <div className="card">
        <div style={{ fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <LineChart size={14} color="#10b981" />
          <span>Native Excel Chart Studio</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Create and embed native Excel interactive charts directly inside your worksheet based on the active selection.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Chart Type:</label>
            <select
              className="select-field"
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ExcelChartType)}
            >
              <option value="ColumnClustered">Column (Clustered)</option>
              <option value="Line">Line</option>
              <option value="Pie">Pie</option>
              <option value="BarClustered">Bar (Horizontal)</option>
              <option value="Scatter">Scatter Plot</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Chart Title:</label>
            <input
              type="text"
              className="input-field"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              placeholder="e.g. Sales Analysis"
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Source Range:</label>
              <input
                type="text"
                className="input-field"
                value={dataRange}
                onChange={(e) => setDataRange(e.target.value)}
                placeholder="e.g. A1:F9"
              />
            </div>

            <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Position:</label>
              <input
                type="text"
                className="input-field"
                value={positionCell}
                onChange={(e) => setPositionCell(e.target.value.toUpperCase())}
                placeholder="H2"
              />
            </div>
          </div>

          <button
            onClick={handleCreateChart}
            disabled={isInserting}
            className="btn btn-primary"
            style={{ marginTop: '6px' }}
          >
            <PieChart size={13} />
            <span>{isInserting ? 'Inserting Chart...' : 'Insert Native Chart into Sheet'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
