export type AIIntent =
  | 'data_profiling'
  | 'data_cleaning'
  | 'transformation'
  | 'exploratory_analysis'
  | 'statistical_test'
  | 'visualization'
  | 'machine_learning'
  | 'excel_formula'
  | 'general_question';

export interface AIActionStep {
  stepId: string;
  order: number;
  engine: 'data' | 'cleaning' | 'statistics' | 'visualization' | 'ml' | 'excel';
  actionName: string;
  parameters: Record<string, unknown>;
  requiresApproval: boolean;
  approvalPrompt?: string;
  status: 'pending' | 'approved' | 'rejected' | 'running' | 'completed' | 'failed';
  result?: unknown;
  error?: string;
}

export interface AIPlan {
  planId: string;
  intent: AIIntent;
  userQuery: string;
  summary: string;
  steps: AIActionStep[];
  confidence: number;
  estimatedComplexity: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface AIExplanation {
  planId: string;
  explanationText: string;
  keyInsights: string[];
  recommendedNextActions: string[];
  scientificCaveats?: string[];
}
