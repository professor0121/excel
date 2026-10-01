import React, { useState } from 'react';
import {
  Bot,
  BarChart2,
  LineChart,
  FunctionSquare,
  PlayCircle,
  History,
  Wifi
} from 'lucide-react';
import { useOffice } from './hooks/useOffice.js';
import { WorkbookBar } from './components/WorkbookBar.js';
import { AiChatTab } from './components/AiChatTab.js';
import { AnalyzeTab } from './components/AnalyzeTab.js';
import { ActionsTab } from './components/ActionsTab.js';
import { VisualizeTab } from './components/VisualizeTab.js';
import { FormulasTab } from './components/FormulasTab.js';
import { HistoryTab, type ActionLogItem } from './components/HistoryTab.js';

type ExcelTab = 'ai-chat' | 'analyze' | 'actions' | 'visualize' | 'formulas' | 'history';

export function App() {
  const [activeTab, setActiveTab] = useState<ExcelTab>('ai-chat');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logs, setLogs] = useState<ActionLogItem[]>([
    {
      id: 'init-log',
      action: 'INITIALIZE',
      details: 'Phase 2 Excel Integration Engine ready',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const officeState = useOffice();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await officeState.refreshContext();
    setIsRefreshing(false);
  };

  const handleLogAction = (action: string, details: string) => {
    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        action,
        details,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      {/* Top Dynamic Workbook Context Bar */}
      <WorkbookBar
        officeState={officeState}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      {/* Tabs */}
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
          className={`excel-tab-btn ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          <PlayCircle size={13} />
          <span>Actions</span>
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
          className={`excel-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={13} />
          <span>History</span>
        </button>
      </div>

      {/* Tab Body */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {activeTab === 'ai-chat' && (
          <AiChatTab
            officeState={officeState}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'analyze' && <AnalyzeTab officeState={officeState} />}
        {activeTab === 'actions' && (
          <ActionsTab officeState={officeState} onLogAction={handleLogAction} />
        )}
        {activeTab === 'visualize' && (
          <VisualizeTab officeState={officeState} onLogAction={handleLogAction} />
        )}
        {activeTab === 'formulas' && (
          <FormulasTab officeState={officeState} onLogAction={handleLogAction} />
        )}
        {activeTab === 'history' && (
          <HistoryTab logs={logs} onClear={() => setLogs([])} />
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
        <span>v0.2.0 • Phase 2 Engine</span>
      </div>
    </div>
  );
}
