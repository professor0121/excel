import { z } from 'zod';

export const descriptiveStatsRequestSchema = z.object({
  datasetId: z.string().min(1, 'Dataset ID is required'),
  columns: z.array(z.string()).min(1, 'At least one column is required')
});

export const correlationRequestSchema = z.object({
  datasetId: z.string().min(1, 'Dataset ID is required'),
  columns: z.array(z.string()).min(2, 'At least two columns are required'),
  method: z.enum(['pearson', 'spearman']).default('pearson')
});

export const hypothesisTestRequestSchema = z.object({
  testType: z.enum([
    't_test_one_sample',
    't_test_two_sample',
    't_test_paired',
    'anova_one_way',
    'chi_square_independence',
    'mann_whitney_u'
  ]),
  datasetId: z.string().min(1, 'Dataset ID is required'),
  targetColumn: z.string().min(1, 'Target column is required'),
  comparisonColumn: z.string().optional(),
  hypothesizedMean: z.number().optional(),
  alpha: z.number().min(0.0001).max(0.2).default(0.05)
});

export type DescriptiveStatsRequest = z.infer<typeof descriptiveStatsRequestSchema>;
export type CorrelationRequest = z.infer<typeof correlationRequestSchema>;
export type HypothesisTestRequestInput = z.infer<typeof hypothesisTestRequestSchema>;
