import type {
  IExcelAdapter,
  ExcelChartRequest,
  ExcelTableData,
  ExcelTableInfo,
  RangeFormattingOptions,
  SafetyCheckResult
} from '../types.js';
import type {
  ExcelWorkbookInfo,
  ExcelRangeData,
  ExcelWriteRequest,
  ExcelOperationResult
} from '@gemini-datalab/shared-types';
import { SafetyGuard } from '../safety/safety-guard.js';

export class MockExcelAdapter implements IExcelAdapter {
  private sheets: string[] = ['SalesData', 'CustomerMetrics', 'Summary'];
  private activeSheet = 'SalesData';

  // In-memory sheet store
  private sheetData: Map<string, unknown[][]> = new Map([
    [
      'SalesData',
      [
        ['Region', 'Product', 'Units', 'Revenue', 'AdSpend', 'Profit'],
        ['North', 'Laptops', 120, 144000, 15000, 48000],
        ['North', 'Phones', 340, 272000, 22000, 85000],
        ['South', 'Laptops', 95, 114000, 11000, 39000],
        ['South', 'Phones', 210, 168000, 14000, 52000],
        ['East', 'Laptops', 180, 216000, 19000, 72000],
        ['East', 'Phones', 410, 328000, 28000, 102000],
        ['West', 'Laptops', 145, 174000, 16000, 58000],
        ['West', 'Phones', 290, 232000, 20000, 74000]
      ]
    ],
    [
      'CustomerMetrics',
      [
        ['Segment', 'ActiveUsers', 'RetentionRate', 'AvgLTV'],
        ['Enterprise', 1200, 0.94, 18500],
        ['MidMarket', 4500, 0.82, 6200],
        ['SmallBusiness', 12800, 0.68, 1400]
      ]
    ],
    ['Summary', []]
  ]);

  private tables: ExcelTableInfo[] = [
    {
      id: 'table-1',
      name: 'SalesTable',
      address: 'SalesData!A1:F9',
      rowCount: 8,
      columnCount: 6,
      headers: ['Region', 'Product', 'Units', 'Revenue', 'AdSpend', 'Profit']
    }
  ];

  public isAvailable(): boolean {
    return true;
  }

  public async getWorkbookInfo(): Promise<ExcelWorkbookInfo> {
    return {
      name: 'Mock_Business_Workbook.xlsx',
      activeSheetName: this.activeSheet,
      sheets: [...this.sheets]
    };
  }

  public async getSelectedRange(): Promise<ExcelRangeData> {
    const data = this.sheetData.get(this.activeSheet) || [];
    const headers = (data[0] as string[]) || [];
    return {
      range: {
        sheetName: this.activeSheet,
        address: `${this.activeSheet}!A1:F${data.length}`,
        rowCount: data.length,
        columnCount: headers.length
      },
      headers,
      values: data.slice(1),
      hasHeaderRow: true
    };
  }

  public async getWorksheetData(
    sheetName: string,
    _rangeAddress?: string
  ): Promise<ExcelRangeData> {
    const data = this.sheetData.get(sheetName) || [];
    const headers = (data[0] as string[]) || [];
    return {
      range: {
        sheetName,
        address: `${sheetName}!A1:Z${data.length || 1}`,
        rowCount: data.length,
        columnCount: headers.length
      },
      headers,
      values: data.slice(1),
      hasHeaderRow: headers.length > 0
    };
  }

  public async getTables(): Promise<ExcelTableInfo[]> {
    return [...this.tables];
  }

  public async getTableData(tableName: string): Promise<ExcelTableData> {
    const table = this.tables.find((t) => t.name === tableName);
    if (!table) {
      throw new Error(`Table ${tableName} not found in workbook`);
    }
    const data = this.sheetData.get(this.activeSheet) || [];
    return {
      name: table.name,
      headers: table.headers,
      rows: (data.slice(1) as (string | number | boolean | null)[][]),
      totalRows: data.length - 1
    };
  }

  public async validateSafety(
    targetAddress: string,
    data: unknown[][],
    sheetName?: string
  ): Promise<SafetyCheckResult> {
    const sheet = sheetName || this.activeSheet;
    const existing = this.sheetData.get(sheet) || [];
    return SafetyGuard.evaluateRisk(targetAddress, existing, data);
  }

  public async writeRange(request: ExcelWriteRequest): Promise<ExcelOperationResult> {
    const sheet = request.sheetName || this.activeSheet;
    if (!this.sheetData.has(sheet) && request.createSheetIfMissing) {
      this.sheets.push(sheet);
      this.sheetData.set(sheet, []);
    }

    const currentData = this.sheetData.get(sheet) || [];
    const merged = [...currentData, ...request.data];
    this.sheetData.set(sheet, merged);

    const affected = request.data.length * (request.data[0]?.length || 0);
    return {
      success: true,
      affectedCells: affected,
      targetAddress: `${sheet}!${request.targetRange}`,
      message: `Successfully wrote ${affected} cell(s) to ${sheet}!${request.targetRange}`,
      timestamp: new Date().toISOString()
    };
  }

  public async createWorksheet(
    sheetName: string,
    data?: unknown[][],
    asTable?: boolean,
    tableName?: string
  ): Promise<string> {
    if (!this.sheets.includes(sheetName)) {
      this.sheets.push(sheetName);
    }
    if (data) {
      this.sheetData.set(sheetName, data);
    } else {
      this.sheetData.set(sheetName, []);
    }

    if (asTable && data && data.length > 0) {
      this.tables.push({
        id: `table-${Date.now()}`,
        name: tableName || `Table_${sheetName}`,
        address: `${sheetName}!A1:Z${data.length}`,
        rowCount: data.length - 1,
        columnCount: data[0]?.length || 0,
        headers: (data[0] as string[]) || []
      });
    }

    this.activeSheet = sheetName;
    return sheetName;
  }

  public async createChart(request: ExcelChartRequest): Promise<ExcelOperationResult> {
    const sheet = request.targetSheet || this.activeSheet;
    return {
      success: true,
      affectedCells: 1,
      targetAddress: `${sheet}!${request.positionCell || 'E2'}`,
      message: `Successfully created ${request.chartType} chart "${request.title}" referencing ${request.dataRange}`,
      timestamp: new Date().toISOString()
    };
  }

  public async insertFormula(
    cellAddress: string,
    formula: string,
    sheetName?: string
  ): Promise<ExcelOperationResult> {
    const sheet = sheetName || this.activeSheet;
    return {
      success: true,
      affectedCells: 1,
      targetAddress: `${sheet}!${cellAddress}`,
      message: `Formula ${formula} successfully inserted at ${sheet}!${cellAddress}`,
      timestamp: new Date().toISOString()
    };
  }

  public async formatRange(
    _address: string,
    _options: RangeFormattingOptions,
    _sheetName?: string
  ): Promise<void> {
    // Simulated formatting in memory
  }
}
