import React, { useState } from 'react';
import { PlayCircle, AlertTriangle, ShieldCheck, Plus, Table2, CheckCircle } from 'lucide-react';
import type { OfficeState } from '../hooks/useOffice.js';
import type { SafetyCheckResult } from '@gemini-datalab/excel-engine';

interface ActionsTabProps {
  officeState: OfficeState;
  onLogAction: (action: string, details: string) => void;
}

export function ActionsTab({ officeState, onLogAction }: ActionsTabProps) {
  const { adapter, activeSheetName, refreshContext } = officeState;

  // State for Create Worksheet
  const [newSheetName, setNewSheetName] = useState('DataLab_Analysis');
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);

  // State for Write Range & Safety
  const [targetCell, setTargetCell] = useState('H2');
  const [safetyCheck, setSafetyCheck] = useState<SafetyCheckResult | null>(null);
  const [isCheckingSafety, setIsCheckingSafety] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Sample analytical summary data to write safely
  const sampleSummaryData = [
    ['Metric', 'Current Value', 'Target', 'Variance'],
    ['Total Units', 1825, 2000, -175],
    ['Gross Revenue', 1284000, 1200000, 84000],
    ['Marketing ROI', 4.38, 4.0, 0.38]
  ];

  const handleCreateSheet = async () => {
    if (!newSheetName.trim()) return;
    setIsCreatingSheet(true);
    setStatusMessage(null);
    try {
      await adapter.createWorksheet(newSheetName, [
        ['Analysis Module', 'Generated Date', 'Status'],
        ['Gemini DataLab Studio', new Date().toLocaleDateString(), 'Active']
      ], true);
      await refreshContext();
      setStatusMessage(`Worksheet "${newSheetName}" created successfully!`);
      onLogAction('CREATE_WORKSHEET', `Created sheet "${newSheetName}" with summary table`);
    } catch (err: unknown) {
      setStatusMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleCheckSafety = async () => {
    setIsCheckingSafety(true);
    setStatusMessage(null);
    try {
      const check = await adapter.validateSafety(targetCell, sampleSummaryData);
      setSafetyCheck(check);
    } catch (err: unknown) {
      setStatusMessage(`Safety check failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsCheckingSafety(false);
    }
  };

  const handleExecuteWrite = async () => {
    if (!safetyCheck) return;
    setIsWriting(true);
    try {
      const result = await adapter.writeRange({
        targetRange: targetCell,
        data: sampleSummaryData,
        asTable: true,
        tableName: `SummaryTable_${Date.now()}`
      });
      await refreshContext();
      setStatusMessage(result.message);
      onLogAction('WRITE_RANGE', `Wrote ${result.affectedCells} cells to ${result.targetAddress}`);
      setSafetyCheck(null);
    } catch (err: unknown) {
      setStatusMessage(`Write error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsWriting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {statusMessage && (
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
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Safety Gate Write Section */}
      <div className="card">
        <div style={{ fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#10b981" />
          <span>Non-Destructive Safe Write Gate</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Write summary metrics or cleaned data back to Excel with automatic overwrite detection and user confirmation.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Target Cell Address:</label>
          <input
            type="text"
            className="input-field"
            value={targetCell}
            onChange={(e) => setTargetCell(e.target.value.toUpperCase())}
            placeholder="e.g. H2 or Sheet2!A1"
          />
        </div>

        <button
          onClick={handleCheckSafety}
          disabled={isCheckingSafety}
          className="btn btn-primary"
          style={{ marginTop: '4px' }}
        >
          <PlayCircle size={13} />
          <span>{isCheckingSafety ? 'Scanning Cells...' : 'Preview & Check Range Safety'}</span>
        </button>
      </div>

      {/* Sheet & Table Automation */}
      <div className="card">
        <div style={{ fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Table2 size={14} color="#8957e5" />
          <span>Worksheet & Table Automation</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>New Analysis Worksheet Name:</label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              className="input-field"
              value={newSheetName}
              onChange={(e) => setNewSheetName(e.target.value)}
              placeholder="Sheet Name"
            />
            <button
              onClick={handleCreateSheet}
              disabled={isCreatingSheet}
              className="btn btn-secondary"
              style={{ whiteSpace: 'nowrap' }}
            >
              <Plus size={12} />
              <span>{isCreatingSheet ? 'Creating...' : 'Create'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Confirmation Modal */}
      {safetyCheck && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {safetyCheck.isSafe ? (
                <ShieldCheck size={20} color="#2ea043" />
              ) : (
                <AlertTriangle size={20} color="#d29922" />
              )}
              <div style={{ fontWeight: 700, fontSize: '13px' }}>Confirm Write Operation</div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Target address: <strong>{safetyCheck.targetAddress}</strong>
            </div>

            <div
              style={{
                padding: '8px',
                borderRadius: '6px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                fontSize: '11px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Risk Assessment:</span>
                <span
                  className={`badge ${
                    safetyCheck.safetyLevel === 'SAFE'
                      ? 'badge-safe'
                      : safetyCheck.safetyLevel === 'DESTRUCTIVE'
                      ? 'badge-danger'
                      : 'badge-warning'
                  }`}
                >
                  {safetyCheck.safetyLevel}
                </span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>
                {safetyCheck.message}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                onClick={() => setSafetyCheck(null)}
                className="btn btn-secondary"
                disabled={isWriting}
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteWrite}
                className={`btn ${safetyCheck.isSafe ? 'btn-success' : 'btn-danger'}`}
                disabled={isWriting}
              >
                {isWriting ? 'Writing...' : 'Confirm & Write to Excel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
