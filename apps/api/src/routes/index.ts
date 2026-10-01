import { Router } from 'express';
import { healthRouter } from './health.routes.js';

const apiRouter: Router = Router();

// API Information
apiRouter.get('/', (_req, res) => {
  res.json({
    name: 'Gemini DataLab API',
    version: '1.0.0',
    phase: 'Phase 1 - Project Foundation',
    status: 'online',
    endpoints: {
      health: '/api/v1/health',
      liveness: '/api/v1/health/live',
      readiness: '/api/v1/health/ready'
    }
  });
});

// Mount modules
apiRouter.use('/health', healthRouter);

export { apiRouter };
