import React from 'react';
import { History, Trash2, Clock, CheckCircle } from 'lucide-react';

export interface ActionLogItem {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

interface HistoryTabProps {
  logs: ActionLogItem[];
  onClear: () => void;
}

export function HistoryTab({ logs, onClear }: HistoryTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <History size={14} color="#818cf8" />
            <span>Workbook Operation Audit Log</span>
          </div>
          {logs.length > 0 && (
            <button
              onClick={onClear}
              className="btn btn-secondary"
              style={{ padding: '2px 8px', fontSize: '10px' }}
              title="Clear Log History"
            >
              <Trash2 size={11} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', padding: '16px' }}>
            No workbook operations executed yet in this session.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {logs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '11px' }}>
                    <CheckCircle size={11} color="#3fb950" />
                    <span>{log.action}</span>
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Clock size={9} />
                    <span>{log.timestamp}</span>
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {log.details}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
