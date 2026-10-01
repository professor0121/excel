import type { IExcelAdapter } from '../types.js';
import { OfficeJsAdapter } from './office-adapter.js';
import { MockExcelAdapter } from './mock-adapter.js';

export function createExcelAdapter(forceMock = false): IExcelAdapter {
  if (forceMock) {
    return new MockExcelAdapter();
  }

  const officeAdapter = new OfficeJsAdapter();
  if (officeAdapter.isAvailable()) {
    return officeAdapter;
  }

  return new MockExcelAdapter();
}
