import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Health & Status Endpoints', () => {
  const app = createApp();

  it('GET /api/v1 should return API metadata and status', async () => {
    const res = await request(app).get('/api/v1');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Gemini DataLab API');
    expect(res.body.status).toBe('online');
    expect(res.body.phase).toBe('Phase 1 - Project Foundation');
  });

  it('GET /api/v1/health/live should return liveness 200', async () => {
    const res = await request(app).get('/api/v1/health/live');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('alive');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /api/v1/health should return health diagnostic data', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.services).toBeDefined();
    expect(res.body.data.services.memory).toBeDefined();
    expect(res.body.data.services.memory.heapUsedMb).toBeGreaterThan(0);
  });

  it('GET /api/v1/non-existent-route should return 404 with error JSON', async () => {
    const res = await request(app).get('/api/v1/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
