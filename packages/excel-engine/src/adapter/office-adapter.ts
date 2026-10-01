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

export class OfficeJsAdapter implements IExcelAdapter {
  public isAvailable(): boolean {
    return (
      typeof Office !== 'undefined' &&
      typeof Excel !== 'undefined' &&
      Boolean(Office?.context?.requirements?.isSetSupported('ExcelApi', '1.1'))
    );
  }

  public async getWorkbookInfo(): Promise<ExcelWorkbookInfo> {
    this.assertAvailable();
    return Excel.run(async (context) => {
      const sheets = context.workbook.worksheets;
      sheets.load('items/name');
      const activeSheet = context.workbook.worksheets.getActiveWorksheet();
      activeSheet.load('name');

      await context.sync();

      return {
        name: 'Workbook',
        activeSheetName: activeSheet.name,
        sheets: sheets.items.map((s) => s.name)
      };
    });
  }

  public async getSelectedRange(): Promise<ExcelRangeData> {
    this.assertAvailable();
    return Excel.run(async (context) => {
      const selectedRange = context.workbook.getSelectedRange();
      const activeSheet = context.workbook.worksheets.getActiveWorksheet();
      activeSheet.load('name');
      selectedRange.load(['address', 'values', 'formulas', 'rowCount', 'columnCount']);

      await context.sync();

      const rawValues = selectedRange.values;
      const formulas = selectedRange.formulas;
      const hasHeader = this.detectHeaderRow(rawValues);

      let headers: string[] = [];
      let values = rawValues;

      if (hasHeader && rawValues.length > 1) {
        headers = rawValues[0]?.map((v) => String(v ?? '')) || [];
        values = rawValues.slice(1);
      }

      return {
        range: {
          sheetName: activeSheet.name,
          address: selectedRange.address,
          rowCount: selectedRange.rowCount,
          columnCount: selectedRange.columnCount
        },
        headers: headers.length > 0 ? headers : undefined,
        values,
        formulas: formulas.length > 0 ? (formulas as string[][]) : undefined,
        hasHeaderRow: hasHeader
      };
    });
  }

  public async getWorksheetData(
    sheetName: string,
    rangeAddress?: string
  ): Promise<ExcelRangeData> {
    this.assertAvailable();
    return Excel.run(async (context) => {
      const sheet = context.workbook.worksheets.getItem(sheetName);
      const targetRange = rangeAddress
        ? sheet.getRange(rangeAddress)
        : sheet.getUsedRange(true);

      targetRange.load(['address', 'values', 'rowCount', 'columnCount']);
      await context.sync();

      const rawValues = targetRange.values;
      const hasHeader = this.detectHeaderRow(rawValues);
      let headers: string[] = [];
      let values = rawValues;

      if (hasHeader && rawValues.length > 1) {
        headers = rawValues[0]?.map((v) => String(v ?? '')) || [];
        values = rawValues.slice(1);
      }

      return {
        range: {
          sheetName,
          address: targetRange.address,
          rowCount: targetRange.rowCount,
          columnCount: targetRange.columnCount
        },
        headers: headers.length > 0 ? headers : undefined,
        values,
        hasHeaderRow: hasHeader
      };
    });
  }

  public async getTables(): Promise<ExcelTableInfo[]> {
    this.assertAvailable();
    return Excel.run(async (context) => {
      const activeSheet = context.workbook.worksheets.getActiveWorksheet();
      const tables = activeSheet.tables;
      tables.load('items/name, items/id, items/rows/count, items/columns/count');

      await context.sync();

      const result: ExcelTableInfo[] = [];
      for (const table of tables.items) {
        const headerRange = table.getHeaderRowRange();
        const fullRange = table.getRange();
        headerRange.load('values');
        fullRange.load('address');
        await context.sync();

        result.push({
          id: table.id,
          name: table.name,
          address: fullRange.address,
          rowCount: table.rows.count,
          columnCount: table.columns.count,
          headers: headerRange.values[0]?.map((h) => String(h ?? '')) || []
        });
      }

      return result;
    });
  }

  public async getTableData(tableName: string): Promise<ExcelTableData> {
    this.assertAvailable();
    return Excel.run(async (context) => {
      const activeSheet = context.workbook.worksheets.getActiveWorksheet();
      const table = activeSheet.tables.getItem(tableName);
      const headerRange = table.getHeaderRowRange();
      const bodyRange = table.getDataBodyRange();

      headerRange.load('values');
      bodyRange.load('values');
      await context.sync();

      const headers = headerRange.values[0]?.map((h) => String(h ?? '')) || [];
      const rows = bodyRange.values as (string | number | boolean | null)[][];

      return {
        name: tableName,
        headers,
        rows,
        totalRows: rows.length
      };
    });
  }

  public async validateSafety(
    targetAddress: string,
    data: unknown[][],
    sheetName?: string
  ): Promise<SafetyCheckResult> {
    this.assertAvailable();
    return Excel.run(async (context) => {
      const sheet = sheetName
        ? context.workbook.worksheets.getItem(sheetName)
        : context.workbook.worksheets.getActiveWorksheet();

      const rowCount = data.length;
      const colCount = data[0]?.length || 1;
      const computedAddress = SafetyGuard.calculateTargetRange(targetAddress, rowCount, colCount);

      const targetRange = sheet.getRange(computedAddress);
      targetRange.load(['values', 'address']);
      await context.sync();

      return SafetyGuard.evaluateRisk(targetRange.address, targetRange.values, data);
    });
  }

  public async writeRange(request: ExcelWriteRequest): Promise<ExcelOperationResult> {
    this.assertAvailable();
    return Excel.run(async (context) => {
      let sheet: Excel.Worksheet;

      if (request.sheetName) {
        if (request.createSheetIfMissing) {
          try {
            sheet = context.workbook.worksheets.getItem(request.sheetName);
            sheet.load('name');
            await context.sync();
          } catch {
            sheet = context.workbook.worksheets.add(request.sheetName);
          }
        } else {
          sheet = context.workbook.worksheets.getItem(request.sheetName);
        }
      } else {
        sheet = context.workbook.worksheets.getActiveWorksheet();
      }

      const rowCount = request.data.length;
      const colCount = request.data[0]?.length || 1;
      const calculatedRange = SafetyGuard.calculateTargetRange(
        request.targetRange,
        rowCount,
        colCount
      );

      const range = sheet.getRange(calculatedRange);
      range.values = request.data;

      if (request.asTable) {
        const table = sheet.tables.add(range, request.applyHeaders ?? true);
        if (request.tableName) {
          table.name = request.tableName;
        }
      }

      range.load('address');
      await context.sync();

      const totalCells = rowCount * colCount;
      return {
        success: true,
        affectedCells: totalCells,
        targetAddress: range.address,
        message: `Successfully updated ${totalCells} cell(s) in ${range.address}`,
        timestamp: new Date().toISOString()
      };
    });
  }

  public async createWorksheet(
    sheetName: string,
    data?: unknown[][],
    asTable?: boolean,
    tableName?: string
  ): Promise<string> {
    this.assertAvailable();
    return Excel.run(async (context) => {
      const newSheet = context.workbook.worksheets.add(sheetName);

      if (data && data.length > 0) {
        const rowCount = data.length;
        const colCount = data[0]?.length || 1;
        const calculatedRange = SafetyGuard.calculateTargetRange('A1', rowCount, colCount);
        const range = newSheet.getRange(calculatedRange);
        range.values = data;

        if (asTable) {
          const table = newSheet.tables.add(range, true);
          if (tableName) {
            table.name = tableName;
          }
        }
      }

      newSheet.activate();
      await context.sync();
      return sheetName;
    });
  }

  public async createChart(request: ExcelChartRequest): Promise<ExcelOperationResult> {
    this.assertAvailable();
    return Excel.run(async (context) => {
      const sheet = request.targetSheet
        ? context.workbook.worksheets.getItem(request.targetSheet)
        : context.workbook.worksheets.getActiveWorksheet();

      const dataRange = sheet.getRange(request.dataRange);
      const chartType = this.mapChartType(request.chartType);

      const chart = sheet.charts.add(chartType, dataRange, Excel.ChartSeriesBy.auto);
      chart.title.text = request.title;
      chart.setPosition(request.positionCell || 'E2', 'M16');

      await context.sync();

      return {
        success: true,
        affectedCells: 1,
        targetAddress: request.dataRange,
        message: `Native Excel ${request.chartType} chart "${request.title}" inserted successfully`,
        timestamp: new Date().toISOString()
      };
    });
  }

  public async insertFormula(
    cellAddress: string,
    formula: string,
    sheetName?: string
  ): Promise<ExcelOperationResult> {
    this.assertAvailable();
    return Excel.run(async (context) => {
      const sheet = sheetName
        ? context.workbook.worksheets.getItem(sheetName)
        : context.workbook.worksheets.getActiveWorksheet();

      const cell = sheet.getRange(cellAddress);
      cell.formulas = [[formula]];
      cell.load('address');

      await context.sync();

      return {
        success: true,
        affectedCells: 1,
        targetAddress: cell.address,
        message: `Formula ${formula} inserted at ${cell.address}`,
        timestamp: new Date().toISOString()
      };
    });
  }

  public async formatRange(
    address: string,
    options: RangeFormattingOptions,
    sheetName?: string
  ): Promise<void> {
    this.assertAvailable();
    return Excel.run(async (context) => {
      const sheet = sheetName
        ? context.workbook.worksheets.getItem(sheetName)
        : context.workbook.worksheets.getActiveWorksheet();

      const range = sheet.getRange(address);
      if (options.bold !== undefined) {
        range.format.font.bold = options.bold;
      }
      if (options.fillColor) {
        range.format.fill.color = options.fillColor;
      }
      if (options.fontColor) {
        range.format.font.color = options.fontColor;
      }
      if (options.numberFormat) {
        range.numberFormat = [[options.numberFormat]];
      }

      await context.sync();
    });
  }

  private assertAvailable(): void {
    if (!this.isAvailable()) {
      throw new Error(
        'Excel host environment not detected. Ensure add-in is running inside Microsoft Excel.'
      );
    }
  }

  private detectHeaderRow(values: unknown[][]): boolean {
    if (values.length < 2) return false;
    const firstRow = values[0];
    const secondRow = values[1];
    if (!firstRow || !secondRow) return false;

    // Check if first row is predominantly non-empty strings and second row has numeric/different types
    const firstRowStrings = firstRow.every(
      (v) => typeof v === 'string' && v.trim().length > 0
    );
    const secondRowNumbers = secondRow.some((v) => typeof v === 'number');

    return firstRowStrings && secondRowNumbers;
  }

  private mapChartType(type: string): Excel.ChartType {
    switch (type) {
      case 'Line':
        return Excel.ChartType.line;
      case 'Pie':
        return Excel.ChartType.pie;
      case 'BarClustered':
        return Excel.ChartType.barClustered;
      case 'Scatter':
        return Excel.ChartType.xyscatter;
      case 'ColumnClustered':
      default:
        return Excel.ChartType.columnClustered;
    }
  }
}
