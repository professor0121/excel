import React, { useState } from 'react';
import { Bot, Send, Sparkles, BarChart2, ShieldCheck, PieChart } from 'lucide-react';
import type { OfficeState } from '../hooks/useOffice.js';

interface AiChatTabProps {
  officeState: OfficeState;
  onNavigateTab: (tab: 'analyze' | 'actions' | 'visualize' | 'formulas') => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionRecommendation?: {
    label: string;
    tab: 'analyze' | 'actions' | 'visualize' | 'formulas';
  };
}

export function AiChatTab({ officeState, onNavigateTab }: AiChatTabProps) {
  const { selectedRange, activeSheetName } = officeState;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello! I'm your Gemini DataLab assistant. I can inspect your active selection on "${activeSheetName}" (${selectedRange?.range.address || 'A1'}), calculate statistical profiles, create native charts, and safely write results to your workbook.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let replyText = `I have received your request for "${userText}". In Phase 2, deterministic Excel operations are ready:`;
    let actionRecommendation: ChatMessage['actionRecommendation'] = undefined;

    const lower = userText.toLowerCase();
    if (lower.includes('chart') || lower.includes('plot') || lower.includes('visual')) {
      replyText = `Ready to visualize your data! Let's configure and insert a native Excel chart using your active range ${selectedRange?.range.address || ''}.`;
      actionRecommendation = { label: 'Open Chart Studio', tab: 'visualize' };
    } else if (lower.includes('profile') || lower.includes('analyze') || lower.includes('inspect')) {
      replyText = `I can analyze the statistical distribution, null percentages, and data types of ${selectedRange?.range.address || 'your selection'}.`;
      actionRecommendation = { label: 'Inspect Selection Profile', tab: 'analyze' };
    } else if (lower.includes('write') || lower.includes('create sheet') || lower.includes('table')) {
      replyText = `Non-destructive safe write operations are ready. We can generate a dedicated summary sheet or write tables with overwrite detection.`;
      actionRecommendation = { label: 'Open Safe Actions', tab: 'actions' };
    } else if (lower.includes('formula') || lower.includes('sum') || lower.includes('lookup')) {
      replyText = `Let's construct and validate an Excel formula with automatic syntax verification.`;
      actionRecommendation = { label: 'Open Formula Assistant', tab: 'formulas' };
    }

    const aiMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'ai',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionRecommendation
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
      {/* Quick Prompts */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onNavigateTab('analyze')}
          className="btn btn-secondary"
          style={{ fontSize: '10px', padding: '3px 8px' }}
        >
          <BarChart2 size={10} color="#58a6ff" />
          <span>Profile Selection</span>
        </button>
        <button
          onClick={() => onNavigateTab('visualize')}
          className="btn btn-secondary"
          style={{ fontSize: '10px', padding: '3px 8px' }}
        >
          <PieChart size={10} color="#10b981" />
          <span>Create Chart</span>
        </button>
        <button
          onClick={() => onNavigateTab('actions')}
          className="btn btn-secondary"
          style={{ fontSize: '10px', padding: '3px 8px' }}
        >
          <ShieldCheck size={10} color="#8957e5" />
          <span>Safe Write Gate</span>
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingRight: '2px'
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: m.sender === 'ai' ? 'var(--bg-secondary)' : 'var(--accent-blue)',
              border: m.sender === 'ai' ? '1px solid var(--border-color)' : 'none',
              color: '#ffffff',
              fontSize: '11px',
              lineHeight: 1.4,
              alignSelf: m.sender === 'ai' ? 'flex-start' : 'flex-end',
              maxWidth: '92%'
            }}
          >
            {m.sender === 'ai' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#818cf8', fontWeight: 600, marginBottom: '4px' }}>
                <Bot size={12} />
                <span>DataLab Assistant</span>
              </div>
            )}
            <div>{m.text}</div>
            {m.actionRecommendation && (
              <button
                onClick={() => onNavigateTab(m.actionRecommendation!.tab)}
                className="btn btn-primary"
                style={{ marginTop: '8px', fontSize: '10px', padding: '3px 8px' }}
              >
                <Sparkles size={11} />
                <span>{m.actionRecommendation.label}</span>
              </button>
            )}
            <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px', textAlign: 'right' }}>
              {m.timestamp}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div style={{ display: 'flex', gap: '6px', paddingTop: '4px' }}>
        <input
          type="text"
          className="input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask DataLab to analyze, plot, or clean..."
        />
        <button onClick={handleSend} className="btn btn-primary" style={{ padding: '6px 10px' }}>
          <Send size={12} />
        </button>
      </div>
    </div>
  );
}
