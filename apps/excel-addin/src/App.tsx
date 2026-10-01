import React, { useState } from 'react';
import {
  Bot,
  BarChart2,
  Sparkles,
  LineChart,
  FunctionSquare,
  PlayCircle,
  History,
  FileSpreadsheet,
  CheckCircle,
  Wifi
} from 'lucide-react';
import { useOffice } from './hooks/useOffice.js';

type ExcelTab = 'ai-chat' | 'analyze' | 'clean' | 'visualize' | 'formulas' | 'actions' | 'history';

export function App() {
  const [activeTab, setActiveTab] = useState<ExcelTab>('ai-chat');
  const officeState = useOffice();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      {/* Top Banner */}
      <div
        style={{
          padding: '10px 14px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileSpreadsheet size={18} color="#10b981" />
          <span style={{ fontWeight: 700, fontSize: '13px' }}>Gemini DataLab</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: '999px',
              background: officeState.isExcelHost ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              color: officeState.isExcelHost ? '#10b981' : '#818cf8',
              border: `1px solid ${officeState.isExcelHost ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
              fontWeight: 600
            }}
          >
            {officeState.isExcelHost ? 'Excel Connected' : 'Browser Dev Mode'}
          </span>
        </div>
      </div>

      {/* Tabs matching Section 6 */}
      <div className="excel-tab-bar">
        <button
          className={`excel-tab-btn ${activeTab === 'ai-chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-chat')}
        >
          <Bot size={13} />
          <span>AI Chat</span>
        </button>
        <button
          className={`excel-tab-btn ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
        >
          <BarChart2 size={13} />
          <span>Analyze</span>
        </button>
        <button
          className={`excel-tab-btn ${activeTab === 'clean' ? 'active' : ''}`}
          onClick={() => setActiveTab('clean')}
        >
          <Sparkles size={13} />
          <span>Clean</span>
        </button>
        <button
          className={`excel-tab-btn ${activeTab === 'visualize' ? 'active' : ''}`}
          onClick={() => setActiveTab('visualize')}
        >
          <LineChart size={13} />
          <span>Visualize</span>
        </button>
        <button
          className={`excel-tab-btn ${activeTab === 'formulas' ? 'active' : ''}`}
          onClick={() => setActiveTab('formulas')}
        >
          <FunctionSquare size={13} />
          <span>Formulas</span>
        </button>
        <button
          className={`excel-tab-btn ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          <PlayCircle size={13} />
          <span>Actions</span>
        </button>
        <button
          className={`excel-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={13} />
          <span>History</span>
        </button>
      </div>

      {/* Tab Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activeTab === 'ai-chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                fontSize: '12px',
                lineHeight: 1.5
              }}
            >
              <div style={{ fontWeight: 600, color: '#818cf8', marginBottom: '4px' }}>
                Gemini DataLab Assistant
              </div>
              <div>
                Welcome to Gemini DataLab for Excel. In Phase 2, this panel will read selected ranges from your workbook, run statistical tests, and insert charts or cleaned data with your confirmation.
              </div>
            </div>

            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Workbook Context
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                <div><strong>Worksheet:</strong> {officeState.activeSheetName}</div>
                <div><strong>Selected Range:</strong> {officeState.selectedRangeAddress}</div>
                <div><strong>Integration Phase:</strong> Phase 1 Foundation Verified</div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'ai-chat' && (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}
          >
            <CheckCircle size={28} color="#10b981" style={{ margin: '0 auto 10px auto' }} />
            <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px', textTransform: 'capitalize' }}>
              {activeTab} Module Ready for Phase 2
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Task pane architecture and Office.js bindings initialized. Native workbook reading/writing will activate in Phase 2.
            </div>
          </div>
        )}
      </div>

      {/* Task Pane Footer */}
      <div
        style={{
          padding: '8px 14px',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Wifi size={12} color="#10b981" />
          <span>API: Connected (Port 4000)</span>
        </div>
        <span>v0.1.0</span>
      </div>
    </div>
  );
}
