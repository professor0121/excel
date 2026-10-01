export interface ExcelWorkbookInfo {
  name: string;
  activeSheetName: string;
  sheets: string[];
}

export interface ExcelRangeAddress {
  sheetName: string;
  address: string; // e.g., 'Sheet1!A1:D50'
  rowCount: number;
  columnCount: number;
}

export interface ExcelRangeData {
  range: ExcelRangeAddress;
  headers?: string[];
  values: unknown[][];
  formulas?: string[][];
  hasHeaderRow: boolean;
}

export interface ExcelWriteRequest {
  targetRange: string; // e.g. 'A1' or 'NewSheet!A1'
  createSheetIfMissing?: boolean;
  sheetName?: string;
  data: (string | number | boolean | null)[][];
  applyHeaders?: boolean;
  asTable?: boolean;
  tableName?: string;
}

export interface ExcelOperationResult {
  success: boolean;
  affectedCells: number;
  targetAddress: string;
  message: string;
  timestamp: string;
}
