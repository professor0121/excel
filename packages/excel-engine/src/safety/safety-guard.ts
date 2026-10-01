import type { SafetyCheckResult, SafetyLevel } from '../types.js';

export class SafetyGuard {
  /**
   * Evaluates the risk of writing data into a target range given the currently
   * existing values in that range.
   */
  public static evaluateRisk(
    targetAddress: string,
    existingValues: unknown[][],
    newData: unknown[][]
  ): SafetyCheckResult {
    const totalTargetCells = newData.length * (newData[0]?.length || 0);

    let existingNonEmptyCells = 0;
    const sampleExistingValues: unknown[] = [];

    for (let r = 0; r < existingValues.length; r++) {
      const row = existingValues[r];
      if (!row) continue;
      for (let c = 0; c < row.length; c++) {
        const val = row[c];
        if (val !== null && val !== undefined && val !== '') {
          existingNonEmptyCells++;
          if (sampleExistingValues.length < 5) {
            sampleExistingValues.push(val);
          }
        }
      }
    }

    let safetyLevel: SafetyLevel = 'SAFE';
    let message = `Target range ${targetAddress} is completely empty. Safe to write.`;
    let requiresConfirmation = false;

    if (existingNonEmptyCells > 0) {
      requiresConfirmation = true;
      if (existingNonEmptyCells >= 100) {
        safetyLevel = 'DESTRUCTIVE';
        message = `CAUTION: Writing to ${targetAddress} will overwrite ${existingNonEmptyCells} existing non-empty cells with existing data. Explicit approval required.`;
      } else {
        safetyLevel = 'WARNING_OVERWRITE';
        message = `Notice: Target range ${targetAddress} contains ${existingNonEmptyCells} non-empty cell(s) that will be overwritten.`;
      }
    }

    return {
      isSafe: safetyLevel === 'SAFE',
      safetyLevel,
      targetAddress,
      existingNonEmptyCells,
      totalTargetCells,
      message,
      requiresConfirmation,
      sampleExistingValues
    };
  }

  /**
   * Helper to parse and calculate target dimensions from an A1-style reference.
   */
  public static calculateTargetRange(
    startCell: string,
    rowCount: number,
    colCount: number
  ): string {
    const match = startCell.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) return startCell;

    const startColLetters = match[1]!.toUpperCase();
    const startRow = parseInt(match[2]!, 10);

    // Convert col letters to 1-based index
    let colIdx = 0;
    for (let i = 0; i < startColLetters.length; i++) {
      colIdx = colIdx * 26 + (startColLetters.charCodeAt(i) - 64);
    }

    const endColIdx = colIdx + colCount - 1;
    const endRow = startRow + rowCount - 1;

    // Convert back to col letters
    let endColLetters = '';
    let temp = endColIdx;
    while (temp > 0) {
      const rem = (temp - 1) % 26;
      endColLetters = String.fromCharCode(65 + rem) + endColLetters;
      temp = Math.floor((temp - 1) / 26);
    }

    return `${startColLetters}${startRow}:${endColLetters}${endRow}`;
  }
}
