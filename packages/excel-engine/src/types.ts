import type {
  ExcelWorkbookInfo,
  ExcelRangeData,
  ExcelWriteRequest,
  ExcelOperationResult
} from '@gemini-datalab/shared-types';

export type {
  ExcelWorkbookInfo,
  ExcelRangeAddress,
  ExcelRangeData,
  ExcelWriteRequest,
  ExcelOperationResult
} from '@gemini-datalab/shared-types';

export type ExcelChartType =
  | 'ColumnClustered'
  | 'Line'
  | 'Pie'
  | 'BarClustered'
  | 'Scatter';

export interface ExcelChartRequest {
  title: string;
  chartType: ExcelChartType;
  dataRange: string; // e.g. 'A1:C10'
  targetSheet?: string;
  positionCell?: string; // Top-left cell where the chart is placed, e.g. 'E2'
}

export interface ExcelTableInfo {
  id: string;
  name: string;
  address: string;
  rowCount: number;
  columnCount: number;
  headers: string[];
}

export interface ExcelTableData {
  name: string;
  headers: string[];
  rows: (string | number | boolean | null)[][];
  totalRows: number;
}

export type SafetyLevel = 'SAFE' | 'WARNING_OVERWRITE' | 'DESTRUCTIVE';

export interface SafetyCheckResult {
  isSafe: boolean;
  safetyLevel: SafetyLevel;
  targetAddress: string;
  existingNonEmptyCells: number;
  totalTargetCells: number;
  message: string;
  requiresConfirmation: boolean;
  sampleExistingValues?: unknown[];
}

export interface RangeFormattingOptions {
  bold?: boolean;
  numberFormat?: string; // e.g. '$#,##0.00' or '0.0%'
  fillColor?: string; // hex, e.g. '#f3f4f6'
  fontColor?: string;
}

/**
 * Core interface abstracting all Excel workbook operations.
 * Allows deterministic processing engines and UI components
 * to interact with Excel without coupling directly to Office.js globals.
 */
export interface IExcelAdapter {
  isAvailable(): boolean;
  getWorkbookInfo(): Promise<ExcelWorkbookInfo>;
  getSelectedRange(): Promise<ExcelRangeData>;
  getWorksheetData(sheetName: string, rangeAddress?: string): Promise<ExcelRangeData>;
  getTables(): Promise<ExcelTableInfo[]>;
  getTableData(tableName: string): Promise<ExcelTableData>;
  validateSafety(targetAddress: string, data: unknown[][], sheetName?: string): Promise<SafetyCheckResult>;
  writeRange(request: ExcelWriteRequest): Promise<ExcelOperationResult>;
  createWorksheet(sheetName: string, data?: unknown[][], asTable?: boolean, tableName?: string): Promise<string>;
  createChart(request: ExcelChartRequest): Promise<ExcelOperationResult>;
  insertFormula(cellAddress: string, formula: string, sheetName?: string): Promise<ExcelOperationResult>;
  formatRange(address: string, options: RangeFormattingOptions, sheetName?: string): Promise<void>;
}
