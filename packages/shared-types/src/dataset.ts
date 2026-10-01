export type DataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'null'
  | 'unknown';

export interface ColumnProfile {
  name: string;
  dataType: DataType;
  inferredType: DataType;
  totalCount: number;
  nullCount: number;
  nullPercentage: number;
  distinctCount: number;
  uniquePercentage: number;
  sampleValues: Array<string | number | boolean | null>;
  min?: number | string;
  max?: number | string;
  mean?: number;
  median?: number;
  stdDev?: number;
}

export interface DatasetMetadata {
  id: string;
  name: string;
  sourceType: 'excel_range' | 'excel_table' | 'csv' | 'xlsx' | 'json';
  rowCount: number;
  columnCount: number;
  columns: ColumnProfile[];
  fileSizeBytes?: number;
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
  version: number;
}

export interface DataQualityReport {
  datasetId: string;
  totalRows: number;
  totalColumns: number;
  duplicateRowsCount: number;
  missingValuesTotal: number;
  columnsWithMissingValues: Array<{
    columnName: string;
    missingCount: number;
    percentage: number;
  }>;
  outlierCounts: Record<string, number>;
  dataHealthScore: number; // 0 to 100
}
