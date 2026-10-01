import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { databaseManager } from './config/database.js';
import { redisManager } from './config/redis.js';

async function bootstrap() {
  logger.info({ env: env.NODE_ENV }, 'Starting Gemini DataLab API server...');

  // Connect to persistent storage
  await databaseManager.connect();
  await redisManager.connect();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(
      `🚀 API Server running at http://${env.API_HOST}:${env.PORT}/api/v1`
    );
    logger.info(
      `🩺 Health checks available at http://${env.API_HOST}:${env.PORT}/api/v1/health`
    );
  });

  // Graceful shutdown handling
  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      logger.info('HTTP server closed');
      await databaseManager.disconnect();
      await redisManager.disconnect();
      logger.info('Graceful shutdown completed. Exiting.');
      process.exit(0);
    });

    // Force exit after 10s if graceful shutdown hangs
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.fatal({ err }, 'Failed to start Gemini DataLab API');
  process.exit(1);
});
