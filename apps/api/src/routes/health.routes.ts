import { Router, type Request, type Response } from 'express';
import { databaseManager } from '../config/database.js';
import { redisManager } from '../config/redis.js';
import type { HealthCheckResult } from '@gemini-datalab/shared-types';

const router: Router = Router();
const startTime = Date.now();

router.get('/', async (_req: Request, res: Response) => {
  const dbHealth = await databaseManager.checkHealth();
  const redisHealth = await redisManager.checkHealth();

  const memUsage = process.memoryUsage();
  const heapUsedMb = Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100;
  const heapTotalMb = Math.round((memUsage.heapTotal / 1024 / 1024) * 100) / 100;
  const rssMb = Math.round((memUsage.rss / 1024 / 1024) * 100) / 100;

  const isDegraded = dbHealth.status !== 'healthy' || redisHealth.status !== 'healthy';
  const overallStatus = isDegraded ? 'degraded' : 'healthy';

  const healthData: HealthCheckResult = {
    status: overallStatus,
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    services: {
      database: dbHealth,
      redis: redisHealth,
      memory: {
        status: heapUsedMb > 1024 ? 'degraded' : 'healthy',
        heapUsedMb,
        heapTotalMb,
        rssMb
      }
    }
  };

  res.status(200).json({
    success: true,
    data: healthData
  });
});

router.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

router.get('/ready', async (_req: Request, res: Response) => {
  const dbHealth = await databaseManager.checkHealth();
  const redisHealth = await redisManager.checkHealth();

  const isReady = dbHealth.status === 'healthy'; // Minimum required is database in production

  if (isReady) {
    res.status(200).json({
      status: 'ready',
      database: dbHealth.status,
      redis: redisHealth.status
    });
  } else {
    res.status(503).json({
      status: 'not_ready',
      database: dbHealth.status,
      redis: redisHealth.status,
      message: 'Critical dependencies not ready'
    });
  }
});

export const healthRouter: Router = router;
