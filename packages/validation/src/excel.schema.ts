import { z } from 'zod';

export const excelWriteRequestSchema = z.object({
  targetRange: z.string().min(1, 'Target cell range is required'),
  createSheetIfMissing: z.boolean().default(false),
  sheetName: z.string().optional(),
  data: z.array(z.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))),
  applyHeaders: z.boolean().default(true),
  asTable: z.boolean().default(false),
  tableName: z.string().optional()
});

export const excelFormulaRequestSchema = z.object({
  cellAddress: z.string().min(1, 'Cell address is required'),
  sheetName: z.string().optional(),
  formula: z.string().startsWith('=', 'Excel formulas must start with =')
});

export type ExcelWriteRequestInput = z.infer<typeof excelWriteRequestSchema>;
export type ExcelFormulaRequestInput = z.infer<typeof excelFormulaRequestSchema>;
