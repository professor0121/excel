import React from 'react';
import { FileSpreadsheet, RefreshCw } from 'lucide-react';
import type { OfficeState } from '../hooks/useOffice.js';

interface WorkbookBarProps {
  officeState: OfficeState;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function WorkbookBar({ officeState, isRefreshing, onRefresh }: WorkbookBarProps) {
  const { isExcelHost, activeSheetName, selectedRange } = officeState;

  return (
    <div
      style={{
        padding: '10px 14px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileSpreadsheet size={16} color="#10b981" />
          <span style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '-0.2px' }}>
            Gemini DataLab
          </span>
          <span
            style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '999px',
              background: isExcelHost ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              color: isExcelHost ? '#10b981' : '#818cf8',
              border: `1px solid ${isExcelHost ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
              fontWeight: 600
            }}
          >
            {isExcelHost ? 'Excel Connected' : 'Browser Dev Mode'}
          </span>
        </div>

        <button
          onClick={onRefresh}
          className="btn btn-secondary"
          title="Refresh Workbook Context"
          style={{ padding: '4px 8px', fontSize: '11px', height: '24px' }}
        >
          <RefreshCw size={11} className={isRefreshing ? 'spin' : ''} />
          <span>Sync</span>
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          color: 'var(--text-secondary)'
        }}
      >
        <span>
          Sheet: <strong style={{ color: 'var(--text-primary)' }}>{activeSheetName}</strong>
        </span>
        <span>•</span>
        <span>
          Selection:{' '}
          <strong style={{ color: 'var(--border-focus)' }}>
            {selectedRange?.range.address || 'Loading...'}
          </strong>
          {selectedRange && (
            <span style={{ marginLeft: '4px', color: 'var(--text-muted)' }}>
              ({selectedRange.range.rowCount}R × {selectedRange.range.columnCount}C)
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
