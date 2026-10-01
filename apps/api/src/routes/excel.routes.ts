import { Router } from 'express';
import {
  excelWriteRequestSchema,
  excelFormulaRequestSchema
} from '@gemini-datalab/validation';
import { SafetyGuard } from '@gemini-datalab/excel-engine';

const excelRouter: Router = Router();

// 1. Validate Write Request & Calculate Target Bounds
excelRouter.post('/validate-write', (req, res) => {
  const parseResult = excelWriteRequestSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid write request payload',
      details: parseResult.error.format()
    });
  }

  const { targetRange, data } = parseResult.data;
  const rowCount = data.length;
  const colCount = data[0]?.length || 0;
  const totalCells = rowCount * colCount;

  const boundingRange = SafetyGuard.calculateTargetRange(targetRange, rowCount, colCount);

  return res.json({
    success: true,
    data: {
      targetRange,
      boundingRange,
      rowCount,
      colCount,
      totalCells,
      isLargeBatch: totalCells > 5000,
      timestamp: new Date().toISOString()
    }
  });
});

// 2. Validate & Inspect Excel Formula
excelRouter.post('/validate-formula', (req, res) => {
  const parseResult = excelFormulaRequestSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid formula request payload',
      details: parseResult.error.format()
    });
  }

  const { cellAddress, formula } = parseResult.data;

  // Extract function tokens (e.g. =SUM(A1:A10) -> SUM)
  const funcMatches = formula.match(/([A-Z_]+)\(/gi) || [];
  const detectedFunctions = funcMatches.map((f) => f.replace('(', '').toUpperCase());

  return res.json({
    success: true,
    data: {
      cellAddress,
      formula,
      isValid: true,
      detectedFunctions,
      timestamp: new Date().toISOString()
    }
  });
});

// 3. Quick Profile Tabular Range Data
excelRouter.post('/profile-range', (req, res) => {
  const { headers = [], values = [] } = req.body as {
    headers?: string[];
    values?: unknown[][];
  };

  if (!Array.isArray(values)) {
    return res.status(400).json({
      success: false,
      error: 'Values must be a 2D array'
    });
  }

  const totalRows = values.length;
  const totalCols = headers.length || values[0]?.length || 0;

  const columnProfiles = (headers.length > 0 ? headers : Array.from({ length: totalCols }, (_, i) => `Column_${i + 1}`)).map(
    (colName, colIdx) => {
      let nullCount = 0;
      let numericCount = 0;
      let textCount = 0;
      let sum = 0;
      let min: number | null = null;
      let max: number | null = null;

      for (let r = 0; r < values.length; r++) {
        const row = values[r];
        const val = row?.[colIdx];

        if (val === null || val === undefined || val === '') {
          nullCount++;
        } else if (typeof val === 'number') {
          numericCount++;
          sum += val;
          if (min === null || val < min) min = val;
          if (max === null || val > max) max = val;
        } else if (!isNaN(Number(val)) && typeof val === 'string' && val.trim() !== '') {
          const num = Number(val);
          numericCount++;
          sum += num;
          if (min === null || num < min) min = num;
          if (max === null || num > max) max = num;
        } else {
          textCount++;
        }
      }

      const inferredType =
        numericCount > textCount ? 'number' : textCount > 0 ? 'string' : 'empty';

      return {
        name: colName,
        index: colIdx,
        inferredType,
        nullCount,
        nullPercentage: totalRows > 0 ? ((nullCount / totalRows) * 100).toFixed(1) : '0',
        stats:
          inferredType === 'number' && numericCount > 0
            ? {
                count: numericCount,
                mean: (sum / numericCount).toFixed(2),
                min,
                max
              }
            : undefined
      };
    }
  );

  return res.json({
    success: true,
    data: {
      totalRows,
      totalColumns: totalCols,
      columnProfiles,
      analyzedAt: new Date().toISOString()
    }
  });
});

export { excelRouter };
