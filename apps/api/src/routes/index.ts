import { Router } from 'express';
import { healthRouter } from './health.routes.js';
import { excelRouter } from './excel.routes.js';

const apiRouter: Router = Router();

// API Information
apiRouter.get('/', (_req, res) => {
  res.json({
    name: 'Gemini DataLab API',
    version: '1.0.0',
    phase: 'Phase 2 - Excel Integration Engine',
    status: 'online',
    endpoints: {
      health: '/api/v1/health',
      liveness: '/api/v1/health/live',
      readiness: '/api/v1/health/ready',
      excel: '/api/v1/excel'
    }
  });
});

// Mount modules
apiRouter.use('/health', healthRouter);
apiRouter.use('/excel', excelRouter);

export { apiRouter };

