import { describe, it, expect } from 'vitest';
import { SafetyGuard } from '../src/safety/safety-guard.js';
import { MockExcelAdapter } from '../src/adapter/mock-adapter.js';
import { createExcelAdapter } from '../src/adapter/factory.js';

describe('SafetyGuard', () => {
  it('correctly calculates target bounding range coordinates', () => {
    expect(SafetyGuard.calculateTargetRange('A1', 5, 3)).toBe('A1:C5');
    expect(SafetyGuard.calculateTargetRange('B2', 10, 4)).toBe('B2:E11');
    expect(SafetyGuard.calculateTargetRange('Z1', 2, 2)).toBe('Z1:AA2');
  });

  it('evaluates completely empty target range as SAFE', () => {
    const existing = [
      ['', null, undefined],
      [null, '', null]
    ];
    const newData = [
      ['A', 'B', 'C'],
      [1, 2, 3]
    ];

    const result = SafetyGuard.evaluateRisk('Sheet1!A1:C2', existing, newData);
    expect(result.isSafe).toBe(true);
    expect(result.safetyLevel).toBe('SAFE');
    expect(result.existingNonEmptyCells).toBe(0);
    expect(result.requiresConfirmation).toBe(false);
  });

  it('evaluates range with existing cells as WARNING_OVERWRITE', () => {
    const existing = [
      ['Existing Header', null],
      [100, 200]
    ];
    const newData = [
      ['New Header', 'Col2'],
      [500, 600]
    ];

    const result = SafetyGuard.evaluateRisk('Sheet1!A1:B2', existing, newData);
    expect(result.isSafe).toBe(false);
    expect(result.safetyLevel).toBe('WARNING_OVERWRITE');
    expect(result.existingNonEmptyCells).toBe(3);
    expect(result.requiresConfirmation).toBe(true);
  });

  it('evaluates range with >= 100 non-empty cells as DESTRUCTIVE', () => {
    const existing: unknown[][] = Array(20)
      .fill(null)
      .map(() => Array(6).fill('data')); // 120 filled cells
    const newData: unknown[][] = Array(20)
      .fill(null)
      .map(() => Array(6).fill('new'));

    const result = SafetyGuard.evaluateRisk('Sheet1!A1:F20', existing, newData);
    expect(result.safetyLevel).toBe('DESTRUCTIVE');
    expect(result.existingNonEmptyCells).toBe(120);
    expect(result.requiresConfirmation).toBe(true);
  });
});

describe('MockExcelAdapter', () => {
  const adapter = new MockExcelAdapter();

  it('detects workbook and active worksheet info', async () => {
    const info = await adapter.getWorkbookInfo();
    expect(info.sheets).toContain('SalesData');
    expect(info.activeSheetName).toBe('SalesData');
  });

  it('reads selected range with headers and values', async () => {
    const range = await adapter.getSelectedRange();
    expect(range.hasHeaderRow).toBe(true);
    expect(range.headers).toEqual(['Region', 'Product', 'Units', 'Revenue', 'AdSpend', 'Profit']);
    expect(range.values.length).toBeGreaterThan(0);
  });

  it('retrieves tables and table data', async () => {
    const tables = await adapter.getTables();
    expect(tables.length).toBe(1);
    expect(tables[0]?.name).toBe('SalesTable');

    const tableData = await adapter.getTableData('SalesTable');
    expect(tableData.headers).toContain('Revenue');
    expect(tableData.rows.length).toBe(8);
  });

  it('writes data safely and updates cell count', async () => {
    const writeResult = await adapter.writeRange({
      targetRange: 'A10',
      data: [['Midwest', 'Laptops', 80, 96000, 10000, 32000]]
    });

    expect(writeResult.success).toBe(true);
    expect(writeResult.affectedCells).toBe(6);
  });

  it('creates new worksheets and charts', async () => {
    const newSheet = await adapter.createWorksheet('AnalysisReport', [['Metric', 'Value'], ['TotalSales', 1500000]]);
    expect(newSheet).toBe('AnalysisReport');

    const chartResult = await adapter.createChart({
      title: 'Sales by Region',
      chartType: 'ColumnClustered',
      dataRange: 'SalesData!A1:F9'
    });
    expect(chartResult.success).toBe(true);
  });
});

describe('createExcelAdapter', () => {
  it('instantiates MockExcelAdapter when Office.js is not present', () => {
    const adapter = createExcelAdapter();
    expect(adapter.isAvailable()).toBe(true);
  });
});
