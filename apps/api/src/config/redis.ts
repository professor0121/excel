import { Redis } from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

class RedisManager {
  private client: Redis | null = null;
  private isConnected = false;

  public getClient(): Redis {
    if (!this.client) {
      this.client = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            return null; // Stop retrying after 3 attempts to allow local dev without redis
          }
          return Math.min(times * 100, 2000);
        },
        lazyConnect: true
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        logger.info('Redis connection established');
      });

      this.client.on('error', (err) => {
        logger.warn({ err: err.message }, 'Redis connection warning/error');
      });

      this.client.on('close', () => {
        this.isConnected = false;
      });
    }

    return this.client;
  }

  public async connect(): Promise<void> {
    try {
      const client = this.getClient();
      await client.connect();
      this.isConnected = true;
    } catch (err: unknown) {
      logger.warn(
        { err: err instanceof Error ? err.message : String(err) },
        'Redis not reachable. Continuing without cache/queues in fallback mode.'
      );
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
      logger.info('Redis connection closed');
    }
  }

  public async checkHealth(): Promise<{ status: 'healthy' | 'unhealthy'; responseTimeMs?: number; message?: string }> {
    if (!this.client || !this.isConnected) {
      return { status: 'unhealthy', message: 'Redis is not connected' };
    }

    const start = Date.now();
    try {
      const pong = await this.client.ping();
      if (pong === 'PONG') {
        return {
          status: 'healthy',
          responseTimeMs: Date.now() - start
        };
      }
      return { status: 'unhealthy', message: `Unexpected response: ${pong}` };
    } catch (err: unknown) {
      return {
        status: 'unhealthy',
        message: err instanceof Error ? err.message : 'Ping failed'
      };
    }
  }
}

export const redisManager = new RedisManager();
