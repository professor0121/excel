import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Excel Integration API Endpoints', () => {
  const app = createApp();

  it('POST /api/v1/excel/validate-write should calculate bounding range and cell counts', async () => {
    const res = await request(app)
      .post('/api/v1/excel/validate-write')
      .send({
        targetRange: 'B2',
        data: [
          ['Header1', 'Header2', 'Header3'],
          [10, 20, 30],
          [40, 50, 60]
        ]
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.targetRange).toBe('B2');
    expect(res.body.data.boundingRange).toBe('B2:D4');
    expect(res.body.data.rowCount).toBe(3);
    expect(res.body.data.colCount).toBe(3);
    expect(res.body.data.totalCells).toBe(9);
  });

  it('POST /api/v1/excel/validate-write should reject invalid payload without target range', async () => {
    const res = await request(app)
      .post('/api/v1/excel/validate-write')
      .send({
        data: [[1, 2]]
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/excel/validate-formula should parse Excel formula and detect functions', async () => {
    const res = await request(app)
      .post('/api/v1/excel/validate-formula')
      .send({
        cellAddress: 'E10',
        formula: '=SUM(B2:B9) + AVERAGE(C2:C9)'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.detectedFunctions).toContain('SUM');
    expect(res.body.data.detectedFunctions).toContain('AVERAGE');
  });

  it('POST /api/v1/excel/validate-formula should reject formulas not starting with =', async () => {
    const res = await request(app)
      .post('/api/v1/excel/validate-formula')
      .send({
        cellAddress: 'E10',
        formula: 'SUM(B2:B9)'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/excel/profile-range should compute column data types, nulls and statistics', async () => {
    const res = await request(app)
      .post('/api/v1/excel/profile-range')
      .send({
        headers: ['Product', 'Price', 'InStock'],
        values: [
          ['Laptop', 1200, true],
          ['Phone', 800, true],
          ['Mouse', 25, false],
          ['Keyboard', null, true]
        ]
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalRows).toBe(4);
    expect(res.body.data.totalColumns).toBe(3);

    const priceProfile = res.body.data.columnProfiles.find((c: { name: string }) => c.name === 'Price');
    expect(priceProfile.inferredType).toBe('number');
    expect(priceProfile.nullCount).toBe(1);
    expect(priceProfile.stats.count).toBe(3);
    expect(Number(priceProfile.stats.min)).toBe(25);
    expect(Number(priceProfile.stats.max)).toBe(1200);
  });
});
