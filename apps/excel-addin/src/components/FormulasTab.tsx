import React, { useState } from 'react';
import { FunctionSquare, CheckCircle, AlertCircle } from 'lucide-react';
import type { OfficeState } from '../hooks/useOffice.js';

interface FormulasTabProps {
  officeState: OfficeState;
  onLogAction: (action: string, details: string) => void;
}

export function FormulasTab({ officeState, onLogAction }: FormulasTabProps) {
  const { adapter, refreshContext } = officeState;

  const [cellAddress, setCellAddress] = useState('F10');
  const [formula, setFormula] = useState('=SUM(C2:C9)');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
    detectedFunctions?: string[];
  } | null>(null);

  const quickTemplates = [
    { label: 'SUM', template: '=SUM(C2:C9)' },
    { label: 'AVERAGE', template: '=AVERAGE(C2:C9)' },
    { label: 'COUNTIF', template: '=COUNTIF(C2:C9, ">100")' },
    { label: 'XLOOKUP', template: '=XLOOKUP("North", A2:A9, D2:D9, "Not Found")' }
  ];

  const handleValidateAndInsert = async () => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      // 1. Validate formula syntax via API
      const valRes = await fetch('/api/v1/excel/validate-formula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cellAddress, formula })
      });

      const json = await valRes.json();
      if (!valRes.ok) {
        setValidationResult({
          valid: false,
          message: json.error || 'Formula syntax validation failed'
        });
        return;
      }

      // 2. Insert formula via Excel adapter
      const result = await adapter.insertFormula(cellAddress, formula);
      await refreshContext();

      setValidationResult({
        valid: true,
        message: result.message,
        detectedFunctions: json.data.detectedFunctions
      });

      onLogAction('INSERT_FORMULA', `Inserted formula ${formula} into ${cellAddress}`);
    } catch (err: unknown) {
      setValidationResult({
        valid: false,
        message: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="card">
        <div style={{ fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FunctionSquare size={14} color="#8957e5" />
          <span>Formula Insertion & Verification</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Write and validate formula expressions with syntax verification and function discovery.
        </div>

        {/* Quick templates */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', margin: '4px 0' }}>
          {quickTemplates.map((t) => (
            <button
              key={t.label}
              onClick={() => setFormula(t.template)}
              className="btn btn-secondary"
              style={{ padding: '2px 8px', fontSize: '10px' }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Target Cell:</label>
              <input
                type="text"
                className="input-field"
                value={cellAddress}
                onChange={(e) => setCellAddress(e.target.value.toUpperCase())}
                placeholder="F10"
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Formula (starts with =):</label>
              <input
                type="text"
                className="input-field"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                placeholder="=SUM(A1:A10)"
              />
            </div>
          </div>

          <button
            onClick={handleValidateAndInsert}
            disabled={isValidating || !formula.startsWith('=')}
            className="btn btn-primary"
            style={{ marginTop: '4px' }}
          >
            <span>{isValidating ? 'Validating & Inserting...' : 'Validate & Insert Formula'}</span>
          </button>
        </div>
      </div>

      {validationResult && (
        <div
          style={{
            padding: '10px',
            borderRadius: '6px',
            background: validationResult.valid ? 'rgba(35, 134, 54, 0.15)' : 'rgba(248, 81, 73, 0.15)',
            border: `1px solid ${validationResult.valid ? 'rgba(46, 160, 67, 0.3)' : 'rgba(248, 81, 73, 0.3)'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontSize: '11px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {validationResult.valid ? (
              <CheckCircle size={14} color="#3fb950" />
            ) : (
              <AlertCircle size={14} color="#f85149" />
            )}
            <span style={{ fontWeight: 600, color: validationResult.valid ? '#3fb950' : '#f85149' }}>
              {validationResult.valid ? 'Formula Applied' : 'Validation Error'}
            </span>
          </div>
          <div>{validationResult.message}</div>
          {validationResult.detectedFunctions && validationResult.detectedFunctions.length > 0 && (
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              Functions identified: {validationResult.detectedFunctions.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
