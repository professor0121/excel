import { z } from 'zod';

export const createDatasetFromRangeSchema = z.object({
  name: z.string().min(1, 'Dataset name is required'),
  sheetName: z.string().min(1, 'Worksheet name is required'),
  rangeAddress: z.string().min(1, 'Range address is required'),
  hasHeaderRow: z.boolean().default(true),
  values: z.array(z.array(z.unknown())).min(1, 'Data values must not be empty')
});

export const datasetQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(1000).default(50),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
});

export type CreateDatasetFromRangeInput = z.infer<typeof createDatasetFromRangeSchema>;
export type DatasetQueryInput = z.infer<typeof datasetQuerySchema>;
