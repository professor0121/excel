import { useState, useEffect } from 'react';

export interface OfficeState {
  isOfficeReady: boolean;
  isExcelHost: boolean;
  activeSheetName: string;
  selectedRangeAddress: string;
  errorMessage: string | null;
}

export function useOffice(): OfficeState {
  const [state, setState] = useState<OfficeState>({
    isOfficeReady: false,
    isExcelHost: false,
    activeSheetName: 'Sheet1',
    selectedRangeAddress: 'A1:A1',
    errorMessage: null
  });

  useEffect(() => {
    // Check if Office global is loaded
    if (typeof Office !== 'undefined') {
      Office.onReady((info) => {
        const isExcel = info.host === Office.HostType.Excel;
        setState((prev) => ({
          ...prev,
          isOfficeReady: true,
          isExcelHost: isExcel
        }));

        if (isExcel && typeof Excel !== 'undefined') {
          // Detect active sheet name
          Excel.run(async (context) => {
            const sheet = context.workbook.worksheets.getActiveWorksheet();
            sheet.load('name');
            await context.sync();
            setState((prev) => ({
              ...prev,
              activeSheetName: sheet.name
            }));
          }).catch((err) => {
            console.warn('Error reading Excel active worksheet:', err);
          });
        }
      });
    } else {
      // In browser development preview without Office.js loaded
      setState((prev) => ({
        ...prev,
        isOfficeReady: true,
        isExcelHost: false
      }));
    }
  }, []);

  return state;
}
