import { useState, useEffect, useCallback, useMemo } from 'react';
import { createExcelAdapter, type IExcelAdapter } from '@gemini-datalab/excel-engine';
import type { ExcelWorkbookInfo, ExcelRangeData } from '@gemini-datalab/shared-types';

export interface OfficeState {
  isOfficeReady: boolean;
  isExcelHost: boolean;
  activeSheetName: string;
  sheets: string[];
  selectedRange: ExcelRangeData | null;
  errorMessage: string | null;
  adapter: IExcelAdapter;
  refreshContext: () => Promise<void>;
}

export function useOffice(): OfficeState {
  const [isOfficeReady, setIsOfficeReady] = useState(false);
  const [isExcelHost, setIsExcelHost] = useState(false);
  const [activeSheetName, setActiveSheetName] = useState('Sheet1');
  const [sheets, setSheets] = useState<string[]>(['Sheet1']);
  const [selectedRange, setSelectedRange] = useState<ExcelRangeData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const adapter = useMemo(() => createExcelAdapter(), []);

  const refreshContext = useCallback(async () => {
    try {
      setErrorMessage(null);
      const wbInfo: ExcelWorkbookInfo = await adapter.getWorkbookInfo();
      setActiveSheetName(wbInfo.activeSheetName);
      setSheets(wbInfo.sheets);

      const sel = await adapter.getSelectedRange();
      setSelectedRange(sel);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    }
  }, [adapter]);

  useEffect(() => {
    if (typeof Office !== 'undefined') {
      Office.onReady((info) => {
        const isExcel = info.host === Office.HostType.Excel;
        setIsOfficeReady(true);
        setIsExcelHost(isExcel);

        refreshContext();

        // Register selection change listener if running inside Excel
        if (isExcel && typeof Excel !== 'undefined') {
          try {
            Excel.run(async (context) => {
              const worksheet = context.workbook.worksheets.getActiveWorksheet();
              if (worksheet && worksheet.onSelectionChanged) {
                worksheet.onSelectionChanged.add(() => {
                  refreshContext().catch(() => {});
                  return Promise.resolve();
                });
                await context.sync();
              }
            }).catch((err) => {
              console.debug('Selection listener registration note:', err);
            });
          } catch (e) {
            console.debug('Excel.run registration error:', e);
          }
        }
      });
    } else {
      setIsOfficeReady(true);
      setIsExcelHost(false);
      refreshContext();
    }
  }, [adapter, refreshContext]);

  return {
    isOfficeReady,
    isExcelHost,
    activeSheetName,
    sheets,
    selectedRange,
    errorMessage,
    adapter,
    refreshContext
  };
}
