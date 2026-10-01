export interface DescriptiveStats {
  column: string;
  count: number;
  mean: number;
  median: number;
  mode?: number[];
  standardDeviation: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  quartiles: {
    q1: number;
    q2: number;
    q3: number;
    iqr: number;
  };
  skewness: number;
  kurtosis: number;
}

export interface CorrelationMatrix {
  columns: string[];
  matrix: number[][]; // N x N pearson / spearman coefficients
  method: 'pearson' | 'spearman';
}

export interface HypothesisTestRequest {
  testType:
    | 't_test_one_sample'
    | 't_test_two_sample'
    | 't_test_paired'
    | 'anova_one_way'
    | 'chi_square_independence'
    | 'mann_whitney_u';
  datasetId: string;
  targetColumn: string;
  comparisonColumn?: string;
  hypothesizedMean?: number;
  alpha: number; // e.g., 0.05
}

export interface HypothesisTestResult {
  testType: string;
  testStatistic: number;
  pValue: number;
  degreesOfFreedom?: number | [number, number];
  alpha: number;
  rejectNull: boolean;
  interpretation: string;
  details: Record<string, unknown>;
}
